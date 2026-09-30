/** @format */
import { Router } from "express";
import {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  cancelOrder,
  getAllOrders,
  getOrderByIdAdmin,
  changeOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// كل مسارات الطلبات تحتاج تسجيل دخول
router.use(protect);

// ===== المستخدم: طلباته هو فقط =====
router.post("/", placeOrder);
router.get("/my", getMyOrders);
router.get("/my/:id", getMyOrderById);
router.patch("/my/:id/cancel", cancelOrder);

// ===== الأدمن: كل الطلبات =====
router.get("/admin", requireAdmin, getAllOrders);
router.get("/admin/:id", requireAdmin, getOrderByIdAdmin);
router.patch("/admin/:id/status", requireAdmin, changeOrderStatus);

export default router;
