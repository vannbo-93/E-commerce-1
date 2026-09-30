/** @format */
import { Router } from "express";
import {
  getMyAddresses,
  getMyAddress,
  addAddress,
  editAddress,
  makeDefaultAddress,
  removeAddress,
} from "../controllers/addressController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// عناوين المستخدم الحالي فقط: كل المسارات تحتاج تسجيل دخول
router.use(protect);

router.get("/", getMyAddresses);
router.post("/", addAddress);
router.get("/:id", getMyAddress);
router.put("/:id", editAddress);
router.patch("/:id/default", makeDefaultAddress);
router.delete("/:id", removeAddress);

export default router;
