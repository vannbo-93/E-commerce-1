/** @format */
import { rateLimit, type Options } from "express-rate-limit";
import type { Request, Response } from "express";

// حدود الطلبات لكل عنوان IP. التخزين في ذاكرة السيرفر: يكفي لسيرفر واحد
// (Render المجاني). مع عدة سيرفرات يلزم مخزن مشترك مثل Redis.
//
// RATE_LIMIT_DISABLED=true في .env يعطّلها كلها (للاختبارات الآلية فقط، لا للإنتاج)

const MINUTE = 60 * 1000;

// رد JSON بنفس شكل بقية أخطاء الـ API، فتعرضه الواجهة كما هو
const jsonHandler =
  (message: string): Options["handler"] =>
  (_req: Request, res: Response) => {
    res.status(429).json({ message });
  };

const limiter = (options: {
  windowMs: number;
  limit: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}) =>
  rateLimit({
    windowMs: options.windowMs,
    limit: options.limit,
    // ترويسات RateLimit-* القياسية: تخبر العميل بالمتبقي ومتى يُعاد الضبط
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests ?? false,
    skip: () => process.env.RATE_LIMIT_DISABLED === "true",
    handler: jsonHandler(options.message),
  });

// ===== عام: لكل الـ API =====
// حدود الطلبات لكل عنوان IP. التخزين في ذاكرة الدالة.
// على Vercel قد تعمل عدة نسخ من الدالة، ولكل منها عدّاد مستقل يُصفَّر مع كل تشغيل جديد،
// فالحد الفعلي أرخى مما هو مكتوب. لحماية صارمة يلزم مخزن مشترك (مثل Upstash Redis).
export const apiLimiter = limiter({
  windowMs: 5 * MINUTE,
  limit: 1000,
  message:
    "Too many requests. Please slow down and try again in a few minutes.",
});

// ===== المصادقة =====

// المحاولات الناجحة لا تُحسب: مستخدم يدخل ويخرج مرارًا لا يُحظر،
// ومن يجرّب كلمات المرور يُوقف بعد 10 محاولات فاشلة
export const loginLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 10,
  skipSuccessfulRequests: true,
  message: "Too many failed login attempts. Please try again in 15 minutes.",
});

export const registerLimiter = limiter({
  windowMs: 60 * MINUTE,
  limit: 5,
  message:
    "Too many accounts created from this network. Please try again later.",
});

export const passwordChangeLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 5,
  skipSuccessfulRequests: true,
  message: "Too many password change attempts. Please try again in 15 minutes.",
});

// ===== النماذج العامة =====

export const contactLimiter = limiter({
  windowMs: 60 * MINUTE,
  limit: 5,
  message:
    "You've sent several messages recently. Please try again in an hour.",
});

// يحمي سمعة بريد المتجر أيضًا: كل اشتراك يرسل رسالة تأكيد لعنوان قد لا يخص صاحب الطلب
export const newsletterLimiter = limiter({
  windowMs: 60 * MINUTE,
  limit: 5,
  message: "Too many subscription attempts. Please try again later.",
});
