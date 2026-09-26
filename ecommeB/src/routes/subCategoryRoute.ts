/** @format */
import { Router } from "express";
import {
  getSubCategories,
  getSubCategory,
  addSubCategory,
  editSubCategory,
  removeSubCategory,
} from "../controllers/subCategoryController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// القراءة متاحة للجميع (تحتاجها لاحقًا صفحات المتجر لفلترة المنتجات)
router.get("/", getSubCategories);
router.get("/:id", getSubCategory);

// الكتابة محمية: أدمن فقط. لا رفع صور هنا، فقط JSON عادي
router.post("/", protect, requireAdmin, addSubCategory);
router.put("/:id", protect, requireAdmin, editSubCategory);
router.delete("/:id", protect, requireAdmin, removeSubCategory);

export default router;
