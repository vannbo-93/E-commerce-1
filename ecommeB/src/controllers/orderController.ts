/** @format */
import type { Request, Response } from "express";
import {
  createOrder,
  listMyOrders,
  getMyOrder,
  cancelMyOrder,
  listAllOrders,
  getOrderForAdmin,
  updateOrderStatus,
} from "../services/orderService.js";
import { handleError } from "../utils/handleError.js";

// نص فقط: لا كائنات تتحول إلى شروط MongoDB
const str = (value: unknown): string =>
  typeof value === "string" ? value : "";

const int = (value: unknown): number | undefined => {
  const n = Number(value);
  return Number.isInteger(n) ? n : undefined;
};

// ===== المستخدم =====

// POST /order — المجموع يُحسب هنا في الباك إند فقط، لا يُقبل أي رقم من المتصفح
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const order = await createOrder(
      req.user!.id,
      str(req.body?.addressId),
      str(req.body?.paymentMethod),
    );
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    handleError(err, res);
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .json(await listMyOrders(req.user!.id, int(req.query.page) ?? 1));
  } catch (err) {
    handleError(err, res);
  }
};

export const getMyOrderById = async (req: Request, res: Response) => {
  try {
    const order = await getMyOrder(req.user!.id, req.params.id as string);
    res.status(200).json({ order });
  } catch (err) {
    handleError(err, res);
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await cancelMyOrder(req.user!.id, req.params.id as string);
    res.status(200).json({ message: "Order cancelled", order });
  } catch (err) {
    handleError(err, res);
  }
};

// ===== الأدمن =====

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = int(req.query.page);
    const limit = int(req.query.limit);
    const result = await listAllOrders({
      status: str(req.query.status),
      search: str(req.query.search),
      ...(page !== undefined ? { page } : {}),
      ...(limit !== undefined ? { limit } : {}),
    });
    res.status(200).json(result);
  } catch (err) {
    handleError(err, res);
  }
};

export const getOrderByIdAdmin = async (req: Request, res: Response) => {
  try {
    const order = await getOrderForAdmin(req.params.id as string);
    res.status(200).json({ order });
  } catch (err) {
    handleError(err, res);
  }
};

export const changeOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await updateOrderStatus(
      req.params.id as string,
      str(req.body?.status),
      str(req.body?.note),
    );
    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    handleError(err, res);
  }
};
