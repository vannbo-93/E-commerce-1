/** @format */
import mongoose from "mongoose";
import Order, {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  type IOrder,
  type OrderStatus,
  type PaymentMethod,
} from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Address from "../models/addressModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { nextSequence } from "../models/counterModel.js";
import { AppError } from "../utils/AppError.js";

// رسوم الشحن: 0 مؤقتًا. غيّرها هنا حين تقرر سياسة الشحن
export const SHIPPING_FEE = 0;

// أرقام الطلبات تبدأ من 1001 بدل 1
const ORDER_NUMBER_OFFSET = 1000;

const MY_ORDERS_PAGE_SIZE = 10;
const ADMIN_MAX_LIMIT = 50;

// الانتقالات المسموحة فقط: لا رجوع من "Delivered" إلى "Pending" مثلًا
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

// الأموال بدقة سنتين: 0.1 + 0.2 في JavaScript = 0.30000000000000004
const money = (value: number) => Math.round(value * 100) / 100;

const assertValidId = (id: string, message: string) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError(message, 404);
};

// ===================== أشكال الرد =====================

export interface OrderSummary {
  _id: string;
  orderNumber: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  total: number;
  itemsCount: number;
  previewImages: string[];
  createdAt: Date;
}

export interface OrderDetail extends OrderSummary {
  items: {
    _id: string;
    product: string;
    name: string;
    image: string | null;
    price: number;
    quantity: number;
    color: string | null;
    lineTotal: number;
  }[];
  shippingAddress: IOrder["shippingAddress"];
  statusHistory: IOrder["statusHistory"];
  itemsTotal: number;
  shippingFee: number;
  // الانتقالات المتاحة الآن: يعرضها الفرونت إند كأزرار دون تكرار القواعد
  allowedTransitions: OrderStatus[];
  canCancel: boolean;
  customer?: { _id: string; username: string; email: string } | null;
}

const toSummary = (order: IOrder): OrderSummary => ({
  _id: order._id.toString(),
  orderNumber: order.orderNumber,
  status: order.status,
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  total: order.total,
  itemsCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
  previewImages: order.items
    .map((i) => i.image)
    .filter((img): img is string => Boolean(img))
    .slice(0, 3),
  createdAt: order.createdAt,
});

const toDetail = (order: IOrder): OrderDetail => ({
  ...toSummary(order),
  items: order.items.map((i) => ({
    _id: i._id.toString(),
    product: i.product.toString(),
    name: i.name,
    image: i.image,
    price: i.price,
    quantity: i.quantity,
    color: i.color,
    lineTotal: i.lineTotal,
  })),
  shippingAddress: order.shippingAddress,
  statusHistory: order.statusHistory,
  itemsTotal: order.itemsTotal,
  shippingFee: order.shippingFee,
  allowedTransitions: TRANSITIONS[order.status],
  canCancel: order.status === "pending",
});

// ===================== المخزون =====================

// يجمع كميات نفس المنتج: الهاتف الأحمر والأسود سطران في السلة لكن مخزون واحد
const quantitiesByProduct = (
  items: { product: string; quantity: number }[],
): Map<string, number> => {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item.product, (map.get(item.product) ?? 0) + item.quantity);
  }
  return map;
};

type ObjectIdLike = { toString(): string };

const restoreStock = async (
  items: { product: ObjectIdLike; quantity: number }[],
) => {
  const byProduct = quantitiesByProduct(
    items.map((i) => ({ product: i.product.toString(), quantity: i.quantity })),
  );
  for (const [productId, qty] of byProduct) {
    // المنتج المحذوف منذ الطلب: updateOne لا يجد شيئًا، ولا ضرر
    await Product.updateOne({ _id: productId }, { $inc: { stock: qty } });
  }
};

// ===================== إنشاء الطلب =====================

export const createOrder = async (
  userId: string,
  addressId: string,
  paymentMethod: string,
): Promise<OrderDetail> => {
  if (!(PAYMENT_METHODS as readonly string[]).includes(paymentMethod)) {
    throw new AppError("This payment method is not available", 400);
  }
  const method = paymentMethod as PaymentMethod;
  if (!mongoose.isValidObjectId(addressId)) {
    throw new AppError("Please choose a shipping address", 400);
  }

  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    throw new AppError("Shipping address not found", 404);
  }

  // 1) حجز السلة ذريًا: تُفرَّغ ويعود محتواها القديم في عملية واحدة.
  //    طلب متزامن ثانٍ (ضغطة مزدوجة) يجدها فارغة فيُرفض، فلا يُنشأ طلبان
  const claimed = await Cart.findOneAndUpdate(
    { user: userId, "items.0": { $exists: true } },
    { $set: { items: [] } },
    { new: false },
  );
  if (!claimed) {
    throw new AppError("Your cart is empty", 400);
  }

  const cartItems = claimed.items.map((i) => ({
    product: i.product.toString(),
    quantity: i.quantity,
    color: i.color ?? null,
  }));

  const reserved: { product: string; quantity: number }[] = [];

  // يعيد محتوى السلة عند الفشل ($push: لا يمسح ما أُضيف إليها في الأثناء)
  const restoreCart = () =>
    Cart.updateOne(
      { user: userId },
      {
        $push: {
          items: {
            $each: claimed.items.map((i) => ({
              product: i.product,
              quantity: i.quantity,
              ...(i.color ? { color: i.color } : {}),
            })),
          },
        },
      },
    );

  try {
    const products = await Product.find({
      _id: { $in: cartItems.map((i) => i.product) },
    })
      .select("name price images colors stock")
      .lean();
    const byId = new Map(products.map((p) => [p._id.toString(), p]));

    // 2) التحقق: المنتج ما زال موجودًا، واللون ما زال متاحًا
    for (const item of cartItems) {
      const p = byId.get(item.product);
      if (!p) {
        throw new AppError(
          "A product in your cart is no longer available. Please review your cart.",
          409,
        );
      }
      if (
        p.colors.length > 0 &&
        (!item.color || !p.colors.includes(item.color))
      ) {
        throw new AppError(
          `"${p.name}" is no longer available in the selected color`,
          409,
        );
      }
    }

    // 3) خصم المخزون ذريًا: "اخصم فقط إن كان المتوفر كافيًا" في عملية واحدة.
    //    طلبان متزامنان على آخر قطعة: ينجح أحدهما فقط
    for (const [productId, qty] of quantitiesByProduct(cartItems)) {
      const result = await Product.updateOne(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
      );
      if (result.modifiedCount !== 1) {
        const name = byId.get(productId)!.name;
        const current = await Product.findById(productId)
          .select("stock")
          .lean();
        const left = current?.stock ?? 0;
        throw new AppError(
          left > 0
            ? `Only ${left} of "${name}" left in stock. Please update your cart.`
            : `"${name}" is out of stock. Please remove it from your cart.`,
          409,
        );
      }
      reserved.push({ product: productId, quantity: qty });
    }

    // 4) لقطة الأسعار والأسماء وقت الطلب
    const items = cartItems.map((item) => {
      const p = byId.get(item.product)!;
      return {
        product: p._id,
        name: p.name,
        image: p.images[0] ?? null,
        price: p.price,
        quantity: item.quantity,
        color: item.color,
        lineTotal: money(p.price * item.quantity),
      };
    });

    const itemsTotal = money(items.reduce((sum, i) => sum + i.lineTotal, 0));
    const orderNumber = ORDER_NUMBER_OFFSET + (await nextSequence("order"));

    const order = await Order.create({
      orderNumber,
      user: userId,
      items,
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        city: address.city,
        street: address.street,
        postalCode: address.postalCode,
      },
      paymentMethod: method,
      paymentStatus: "unpaid",
      status: "pending",
      statusHistory: [{ status: "pending", at: new Date(), note: "" }],
      itemsTotal,
      shippingFee: SHIPPING_FEE,
      total: money(itemsTotal + SHIPPING_FEE),
    });

    return toDetail(order);
  } catch (err) {
    // أي فشل: المخزون المحجوز يعود، والسلة تعود كما كانت
    await restoreStock(reserved);
    await restoreCart();
    throw err;
  }
};

// ===================== المستخدم =====================

export const listMyOrders = async (userId: string, page: number) => {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const filter = { user: userId };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ _id: -1 })
      .skip((safePage - 1) * MY_ORDERS_PAGE_SIZE)
      .limit(MY_ORDERS_PAGE_SIZE),
    Order.countDocuments(filter),
  ]);

  return {
    orders: orders.map(toSummary),
    total,
    page: safePage,
    pages: Math.max(1, Math.ceil(total / MY_ORDERS_PAGE_SIZE)),
  };
};

// طلب مستخدم آخر يعود 404 كأنه غير موجود
export const getMyOrder = async (
  userId: string,
  orderId: string,
): Promise<OrderDetail> => {
  assertValidId(orderId, "Order not found");
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new AppError("Order not found", 404);
  return toDetail(order);
};

// العميل يلغي فقط ما لم يؤكده المتجر بعد
export const cancelMyOrder = async (
  userId: string,
  orderId: string,
): Promise<OrderDetail> => {
  assertValidId(orderId, "Order not found");

  // الشرط status: "pending" داخل نفس العملية: لا سباق مع أدمن يؤكد الطلب في نفس اللحظة
  const order = await Order.findOneAndUpdate(
    { _id: orderId, user: userId, status: "pending" },
    {
      $set: { status: "cancelled" },
      $push: {
        statusHistory: {
          status: "cancelled",
          at: new Date(),
          note: "Cancelled by customer",
        },
      },
    },
    { new: true },
  );

  if (!order) {
    const exists = await Order.exists({ _id: orderId, user: userId });
    if (!exists) throw new AppError("Order not found", 404);
    throw new AppError(
      "This order can no longer be cancelled. Please contact support.",
      400,
    );
  }

  await restoreStock(order.items);
  return toDetail(order);
};

// ===================== الأدمن =====================

export interface AdminOrderQuery {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const listAllOrders = async (q: AdminOrderQuery) => {
  const filter: Record<string, unknown> = {};

  if (q.status) {
    if (!(ORDER_STATUSES as readonly string[]).includes(q.status)) {
      throw new AppError(
        `status must be one of: ${ORDER_STATUSES.join(", ")}`,
        400,
      );
    }
    filter.status = q.status;
  }

  // البحث برقم الطلب: "#1024" أو "1024"
  if (q.search) {
    const n = Number(q.search.replace(/^#/, "").trim());
    if (!Number.isInteger(n)) {
      throw new AppError("Search by order number, e.g. 1024", 400);
    }
    filter.orderNumber = n;
  }

  const limit = Math.min(
    Math.max(1, Number.isInteger(q.limit) ? q.limit! : 20),
    ADMIN_MAX_LIMIT,
  );
  const page = Number.isInteger(q.page) && q.page! > 0 ? q.page! : 1;

  const [orders, total, statusCounts] = await Promise.all([
    Order.find(filter)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate<{
        user: {
          _id: mongoose.Types.ObjectId;
          username: string;
          email: string;
        } | null;
      }>("user", "username email"),
    Order.countDocuments(filter),
    // عدد الطلبات في كل حالة: لتبويبات الفلترة في لوحة الأدمن
    Order.aggregate<{ _id: OrderStatus; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const counts = Object.fromEntries(
    ORDER_STATUSES.map((s) => [s, 0]),
  ) as Record<OrderStatus, number>;
  for (const c of statusCounts) counts[c._id] = c.count;

  return {
    orders: orders.map((o) => ({
      ...toSummary(o as unknown as IOrder),
      customer: o.user
        ? {
            _id: o.user._id.toString(),
            username: o.user.username,
            email: o.user.email,
          }
        : null,
      city: o.shippingAddress.city,
    })),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    counts,
  };
};

const withCustomer = async (order: IOrder): Promise<OrderDetail> => {
  const user = await User.findById(order.user).select("username email").lean();
  return {
    ...toDetail(order),
    customer: user
      ? { _id: user._id.toString(), username: user.username, email: user.email }
      : null,
  };
};

export const getOrderForAdmin = async (
  orderId: string,
): Promise<OrderDetail> => {
  assertValidId(orderId, "Order not found");
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);
  return withCustomer(order);
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: string,
  note: string,
): Promise<OrderDetail> => {
  assertValidId(orderId, "Order not found");
  if (!(ORDER_STATUSES as readonly string[]).includes(newStatus)) {
    throw new AppError(
      `status must be one of: ${ORDER_STATUSES.join(", ")}`,
      400,
    );
  }
  const target = newStatus as OrderStatus;

  const current = await Order.findById(orderId);
  if (!current) throw new AppError("Order not found", 404);

  if (!TRANSITIONS[current.status].includes(target)) {
    throw new AppError(
      `Cannot change an order from "${current.status}" to "${target}"`,
      400,
    );
  }

  const set: Record<string, unknown> = { status: target };
  // الدفع عند الاستلام: التسليم يعني أن المبلغ قُبض
  if (target === "delivered" && current.paymentMethod === "cod") {
    set.paymentStatus = "paid";
  }

  // الشرط status: current.status: إن غيّر أدمن آخر الحالة في نفس اللحظة، يفشل هذا التحديث
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: current.status },
    {
      $set: set,
      $push: {
        statusHistory: {
          status: target,
          at: new Date(),
          note: note.trim().slice(0, 300),
        },
      },
    },
    { new: true },
  );

  if (!order) {
    throw new AppError(
      "This order was updated by someone else. Refresh and try again.",
      409,
    );
  }

  if (target === "cancelled") {
    await restoreStock(order.items);
  }

  return withCustomer(order);
};
