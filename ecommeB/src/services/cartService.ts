/** @format */
import mongoose from "mongoose";
import Cart, { type ICart } from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { AppError } from "../utils/appError.js";

const MAX_QUANTITY = 99;

export interface CartItemResponse {
  _id: string;
  quantity: number;
  color: string | null;
  lineTotal: number;
  product: {
    _id: string;
    name: string;
    price: number;
    priceBeforeDiscount: number | null;
    image: string | null;
    brand: string | null;
    category: string | null;
  };
}

export interface CartResponse {
  items: CartItemResponse[];
  totalQuantity: number;
  totalPrice: number;
}

const emptyCart = (): CartResponse => ({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
});

const assertValidQuantity = (quantity: number) => {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    throw new AppError(
      `Quantity must be a whole number between 1 and ${MAX_QUANTITY}`,
      400,
    );
  }
};

const assertValidId = (id: string, label: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
};

// يبني رد السلة بأسعار حيّة من قاعدة البيانات، ويحذف أسطر المنتجات المحذوفة
const toCartResponse = async (cart: ICart | null): Promise<CartResponse> => {
  if (!cart || cart.items.length === 0) return emptyCart();

  const products = await Product.find({
    _id: { $in: cart.items.map((i) => i.product) },
  })
    .select("name price priceBeforeDiscount images brand category")
    .populate<{ brand: { name: string } | null }>("brand", "name")
    .populate<{ category: { name: string } | null }>("category", "name")
    .lean();

  const byId = new Map(products.map((p) => [p._id.toString(), p]));

  // منتج حُذف من المتجر بعد إضافته للسلة: نزيله من السلة بصمت
  const staleIds = cart.items
    .filter((i) => !byId.has(i.product.toString()))
    .map((i) => i._id);
  if (staleIds.length > 0) {
    for (const id of staleIds) cart.items.pull(id);
    await cart.save();
  }

  const items: CartItemResponse[] = [];
  for (const item of cart.items) {
    const p = byId.get(item.product.toString());
    if (!p) continue;
    items.push({
      _id: item._id.toString(),
      quantity: item.quantity,
      color: item.color ?? null,
      lineTotal: p.price * item.quantity,
      product: {
        _id: p._id.toString(),
        name: p.name,
        price: p.price,
        priceBeforeDiscount: p.priceBeforeDiscount ?? null,
        image: p.images[0] ?? null,
        brand: p.brand?.name ?? null,
        category: p.category?.name ?? null,
      },
    });
  }

  return {
    items,
    totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce((sum, i) => sum + i.lineTotal, 0),
  };
};

export const getCart = async (userId: string): Promise<CartResponse> => {
  const cart = await Cart.findOne({ user: userId });
  return toCartResponse(cart);
};

export interface AddToCartInput {
  productId: string;
  quantity: number;
  color?: string;
}

export const addToCart = async (
  userId: string,
  input: AddToCartInput,
): Promise<CartResponse> => {
  assertValidId(input.productId, "product id");
  assertValidQuantity(input.quantity);

  const product = await Product.findById(input.productId).select("colors");
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // اللون إلزامي فقط إن كان للمنتج ألوان، ويجب أن يكون أحدها
  let color: string | undefined;
  if (product.colors.length > 0) {
    if (!input.color) {
      throw new AppError("Please choose a color", 400);
    }
    if (!product.colors.includes(input.color)) {
      throw new AppError("This color is not available for this product", 400);
    }
    color = input.color;
  }

  // ينشئ السلة إن لم توجد، بعملية واحدة
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, items: [] } },
    { upsert: true, new: true },
  );

  // نفس المنتج ونفس اللون موجود مسبقًا: نزيد الكمية بدل سطر جديد
  const existing = cart.items.find(
    (i) =>
      i.product.toString() === input.productId &&
      (i.color ?? null) === (color ?? null),
  );

  if (existing) {
    existing.quantity = Math.min(
      existing.quantity + input.quantity,
      MAX_QUANTITY,
    );
  } else {
    cart.items.push({
      product: product._id,
      quantity: input.quantity,
      ...(color ? { color } : {}),
    });
  }

  await cart.save();
  return toCartResponse(cart);
};

export const updateCartItemQuantity = async (
  userId: string,
  itemId: string,
  quantity: number,
): Promise<CartResponse> => {
  assertValidId(itemId, "item id");
  assertValidQuantity(quantity);

  const cart = await Cart.findOne({ user: userId });
  const item = cart?.items.id(itemId);
  if (!cart || !item) {
    throw new AppError("Item not found in your cart", 404);
  }

  item.quantity = quantity;
  await cart.save();
  return toCartResponse(cart);
};

export const removeCartItem = async (
  userId: string,
  itemId: string,
): Promise<CartResponse> => {
  assertValidId(itemId, "item id");

  const cart = await Cart.findOne({ user: userId });
  if (!cart || !cart.items.id(itemId)) {
    throw new AppError("Item not found in your cart", 404);
  }

  cart.items.pull(itemId);
  await cart.save();
  return toCartResponse(cart);
};

export const clearCart = async (userId: string): Promise<CartResponse> => {
  await Cart.updateOne({ user: userId }, { $set: { items: [] } });
  return emptyCart();
};
