/** @format */

import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// يحدد هوية المستخدم الحالي؛ يعتمد عليه AuthContext في الفرونت إند عند كل تحميل للتطبيق
router.get("/me", protect, getMe);

export default router;
