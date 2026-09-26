/** @format */
import { Router } from "express";
import {
  getBrands,
  getBrand,
  addBrand,
  editBrand,
  removeBrand,
} from "../controllers/brandController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { upload, handleUploadError } from "../middlewares/uploadMiddleware.js";

const router = Router();

// القراءة متاحة للجميع، مطابقة لـ AllBrandPage العامة
router.get("/", getBrands);
router.get("/:id", getBrand);

// الكتابة محمية: أدمن فقط، مطابقة لـ AdminAddBrand
router.post(
  "/",
  protect,
  requireAdmin,
  upload.single("image"),
  handleUploadError,
  addBrand,
);
router.put("/:id", protect, requireAdmin, editBrand);
router.delete("/:id", protect, requireAdmin, removeBrand);

export default router;
