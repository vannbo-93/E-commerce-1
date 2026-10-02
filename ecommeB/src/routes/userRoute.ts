/** @format */

import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  changeMyPassword,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  loginLimiter,
  registerLimiter,
  passwordChangeLimiter,
} from "../middlewares/rateLimiters.js";

const router = Router();

// حدود المحاولات قبل الكنترولر: الطلب الزائد يُرفض قبل أي استعلام لقاعدة البيانات
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

// يحدد هوية المستخدم الحالي؛ يعتمد عليه AuthContext في الفرونت إند عند كل تحميل للتطبيق
router.get("/me", protect, getMe);

// صفحة Profile
router.patch("/me", protect, updateMe);
router.patch("/me/password", protect, passwordChangeLimiter, changeMyPassword);

export default router;
