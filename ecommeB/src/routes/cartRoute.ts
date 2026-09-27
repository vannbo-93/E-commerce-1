/** @format */
import { Router } from "express";
import {
  getMyCart,
  addItem,
  updateItem,
  removeItem,
  clearMyCart,
} from "../controllers/CartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// السلة خاصة بكل مستخدم: كل المسارات تحتاج تسجيل دخول
router.use(protect);

router.get("/", getMyCart);
router.post("/", addItem);
router.delete("/", clearMyCart);
router.patch("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);

export default router;
