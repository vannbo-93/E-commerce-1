/** @format */
import { Router } from "express";
import {
  getMyWishlist,
  addProduct,
  removeProduct,
} from "../controllers/wishlistController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// المفضلة خاصة بكل مستخدم: كل المسارات تحتاج تسجيل دخول
router.use(protect);

router.get("/", getMyWishlist);
// إضافة وحذف صريحان بدل "تبديل": تكرار أي منهما لا يغيّر النتيجة
router.post("/:productId", addProduct);
router.delete("/:productId", removeProduct);

export default router;
