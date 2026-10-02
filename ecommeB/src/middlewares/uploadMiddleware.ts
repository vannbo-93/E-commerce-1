/** @format */
import multer from "multer";
import type { Request, Response, NextFunction } from "express";

// الصور تُحفظ في الذاكرة مؤقتًا، لا على القرص مباشرة.
// imageStorage.ts يقرر بعدها: Cloudinary في الإنتاج، أو مجلد uploads/ محليًا.
// وفائدة إضافية: لا تُكتب أي صورة قبل نجاح التحقق من باقي النموذج،
// فالطلب الناقص لم يعد يترك ملفات يتيمة
const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, WEBP or GIF images are allowed"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 ميجابايت كحد أقصى
});

// يلتقط أخطاء multer تحديدًا (نوع ملف مرفوض، حجم أكبر من الحد) قبل أن تهرب
// إلى أي معالج أخطاء عام آخر في المشروع، ويعيد رسالة JSON واضحة بدلها
export const handleUploadError = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};