/** @format */
import { Router } from "express";
import { submitContactMessage } from "../controllers/contactController.js";

const router = Router();

// عام: الزائر يستطيع التواصل دون حساب
router.post("/", submitContactMessage);

export default router;
