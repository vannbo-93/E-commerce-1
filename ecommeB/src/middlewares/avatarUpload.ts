/** @format */
import multer from "multer";
import type { Request, Response, NextFunction } from "express";

// رفع الصورة الشخصية: في الذاكرة، ثم imageStorage يقرر (Cloudinary أو محلي).
// حد 2 ميجابايت: صورة شخصية تُعرض صغيرة، فلا داعي لملفات أكبر
export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG or WEBP images are allowed"));
    }
    cb(null, true);
  },
});

// أخطاء الرفع (حجم أو نوع) برسالة JSON واضحة و 400، بدل 500 عام
export const handleAvatarUploadError = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image is too large (maximum 2 MB)"
        : `Upload error: ${err.message}`;
    return res.status(400).json({ message });
  }
  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};
