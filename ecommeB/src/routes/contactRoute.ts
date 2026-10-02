/** @format */
import { Router } from "express";
import {
  submitContactMessage,
  getContactMessages,
  getUnreadCount,
  changeContactMessageStatus,
} from "../controllers/contactController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { contactLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

// عام: الزائر يستطيع التواصل دون حساب
router.post("/", contactLimiter, submitContactMessage);

// الأدمن: قراءة الرسائل وإدارتها
router.get("/admin", protect, requireAdmin, getContactMessages);
router.get("/admin/unread-count", protect, requireAdmin, getUnreadCount);
router.patch(
  "/admin/:id/status",
  protect,
  requireAdmin,
  changeContactMessageStatus,
);

export default router;
