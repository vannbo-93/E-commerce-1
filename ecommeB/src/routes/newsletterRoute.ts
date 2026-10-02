/** @format */
import { Router } from "express";
import {
  subscribeToNewsletter,
  showConfirmPage,
  confirmNewsletter,
  showUnsubscribePage,
  unsubscribeNewsletter,
} from "../controllers/newsletterController.js";
import { newsletterLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

// كل المسارات عامة: صاحب البريد لا يحتاج حسابًا في المتجر

// الاشتراك من نموذج الصفحة الرئيسية
router.post("/", newsletterLimiter, subscribeToNewsletter);

// رابط التأكيد في البريد: GET يعرض زرًا، POST ينفّذ
router.get("/confirm", showConfirmPage);
router.post("/confirm", confirmNewsletter);

// رابط الإلغاء في كل رسالة: GET يعرض زرًا، POST ينفّذ
router.get("/unsubscribe", showUnsubscribePage);
router.post("/unsubscribe", unsubscribeNewsletter);

export default router;
