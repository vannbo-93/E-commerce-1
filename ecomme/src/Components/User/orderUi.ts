/** @format */
import { isAxiosError } from "axios";

// نفس أشكال رد الباك إند (orderService.ts)
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderSummary {
  _id: string;
  orderNumber: number;
  status: OrderStatus;
  paymentMethod: "cod";
  paymentStatus: "unpaid" | "paid" | "refunded";
  total: number;
  itemsCount: number;
  previewImages: string[];
  createdAt: string;
}

export interface OrderItem {
  _id: string;
  product: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  color: string | null;
  lineTotal: number;
}

export interface OrderDetail extends OrderSummary {
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    street: string;
    postalCode: string;
  };
  statusHistory: { status: OrderStatus; at: string; note: string }[];
  itemsTotal: number;
  shippingFee: number;
  allowedTransitions: OrderStatus[];
  canCancel: boolean;
  customer?: { _id: string; username: string; email: string } | null;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-sky-50 text-sky-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

export const PAYMENT_LABEL: Record<OrderSummary["paymentMethod"], string> = {
  cod: "Cash on delivery",
};

export const PAYMENT_STATUS_LABEL: Record<
  OrderSummary["paymentStatus"],
  string
> = {
  unpaid: "Not paid yet",
  paid: "Paid",
  refunded: "Refunded",
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export const formatDate = (iso: string, withTime = false) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" as const } : {}),
  }).format(new Date(iso));

export const apiErrorMessage = (err: unknown) =>
  isAxiosError(err)
    ? (err.response?.data?.message ?? "Something went wrong")
    : "Something went wrong";
