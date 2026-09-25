/** @format */
import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = "uploads";

// ينشئ المجلد تلقائيًا إن لم يكن موجودًا، بدل أن يفشل multer بصمت
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // اسم فريد يمنع تصادم الملفات: الوقت الحالي + امتداد الملف الأصلي
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

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
  _req: import("express").Request,
  res: import("express").Response,
  next: import("express").NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};
