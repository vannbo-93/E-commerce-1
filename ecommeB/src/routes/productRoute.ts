/** @format */
import { Router } from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { upload, handleUploadError } from "../middlewares/uploadMiddleware.js";

const router = Router();

// القراءة متاحة للجميع، مطابقة لصفحات المتجر العامة
router.get("/", getProducts);
router.get("/:id", getProduct);

// الكتابة محمية: أدمن فقط، مطابقة لـ AdminAddProducts
router.post(
  "/",
  protect,
  requireAdmin,
  upload.array("images", 6),
  handleUploadError,
  addProduct,
);
router.put(
  "/:id",
  protect,
  requireAdmin,
  upload.array("images", 6),
  handleUploadError,
  editProduct,
);
router.delete("/:id", protect, requireAdmin, removeProduct);

export default router;
