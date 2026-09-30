/** @format */
import { Schema, model, type Document, type Model, type Types } from "mongoose";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

// "cod" فقط الآن؛ الدفع الإلكتروني يُضاف هنا لاحقًا دون تغيير بنية الطلب
export const PAYMENT_METHODS = ["cod"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type PaymentStatus = "unpaid" | "paid" | "refunded";

// لقطة من المنتج وقت الطلب: تغيير سعره أو اسمه لاحقًا لا يغيّر طلبًا قديمًا
export interface IOrderItem {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  color: string | null;
  lineTotal: number;
}

// لقطة من العنوان وقت الطلب: تعديله أو حذفه لاحقًا لا يغيّر عنوان شحن طلب قديم
export interface IShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  street: string;
  postalCode: string;
}

export interface IStatusChange {
  status: OrderStatus;
  at: Date;
  note: string;
}

export interface IOrder extends Document {
  orderNumber: number;
  user: Types.ObjectId;
  items: Types.DocumentArray<IOrderItem>;
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory: IStatusChange[];
  itemsTotal: number;
  shippingFee: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, default: null },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  color: { type: String, default: null },
  lineTotal: { type: Number, required: true, min: 0 },
});

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, default: "" },
  },
  { _id: false },
);

const statusChangeSchema = new Schema<IStatusChange>(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    at: { type: Date, required: true },
    note: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: Number, required: true, unique: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr: unknown[]) => arr.length > 0,
        message: "An order must contain at least one item",
      },
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
      index: true,
    },
    statusHistory: { type: [statusChangeSchema], default: [] },
    itemsTotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

const Order: Model<IOrder> = model<IOrder>("Order", orderSchema);

export default Order;
