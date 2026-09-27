/** @format */
import { Router } from "express";
import {
  getProductReviews,
  getFeatured,
  addReview,
  removeReview,
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// أفضل التقييمات عبر كل المنتجات، للصفحة الرئيسية
router.get("/featured", getFeatured);

// القراءة عامة: أي زائر يستطيع رؤية التقييمات دون تسجيل دخول
router.get("/product/:productId", getProductReviews);

// الإضافة تحتاج تسجيل دخول فقط (أي مستخدم، لا شرط أدمن)
router.post("/product/:productId", protect, addReview);

// الحذف: صاحب التعليق أو الأدمن، يُتحقق منه داخل الخدمة
router.delete("/:id", protect, removeReview);

export default router;
