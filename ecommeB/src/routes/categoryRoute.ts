/** @format */
import { Router } from "express";
import {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  removeCategory,
} from "../controllers/categoryController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { upload, handleUploadError } from "../middlewares/uploadMiddleware.js";

const router = Router();

// القراءة متاحة للجميع، مطابقة لـ HomeCategory وCategoryContainer العامتين
router.get("/", getCategories);
router.get("/:id", getCategory);

// الكتابة محمية: أدمن فقط، مطابقة لـ AdminAddCategory
// upload.single("image") يقرأ الملف من multipart/form-data قبل وصول addCategory
router.post( "/", protect, requireAdmin, upload.single("image"), handleUploadError, addCategory,
);
router.put("/:id", protect, requireAdmin, editCategory);
router.delete("/:id", protect, requireAdmin, removeCategory);

export default router;
