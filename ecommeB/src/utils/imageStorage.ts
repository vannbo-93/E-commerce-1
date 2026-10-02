/** @format */
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

// مكان واحد يقرر أين تُحفظ الصور:
// - مع متغيرات Cloudinary الثلاثة في .env  → Cloudinary (الإنتاج)
// - بدونها                                   → مجلد uploads/ المحلي (التطوير)
// الحذف يقرر بحسب رابط الصورة نفسه، لا بحسب البيئة: بيانات مختلطة لا تنكسر

const UPLOAD_DIR = "uploads";

const cloudinaryEnv = () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const usingCloudinary = () => {
  const env = cloudinaryEnv();
  return Boolean(env.cloud_name && env.api_key && env.api_secret);
};

// الضبط عند أول استخدام لا عند تحميل الملف:
// index.ts يستورد المسارات قبل dotenv.config()، فقد لا تكون .env مقروءة بعد
let cloudinaryConfigured = false;
const ensureCloudinary = () => {
  if (cloudinaryConfigured) return;
  const { cloud_name, api_key, api_secret } = cloudinaryEnv();
  // حذف صورة من Cloudinary على جهاز بلا إعداداته: خطأ واضح بدل فشل غامض
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary is not configured: CLOUDINARY_* variables are missing",
    );
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  cloudinaryConfigured = true;
};

const cloudinaryFolder = () => process.env.CLOUDINARY_FOLDER ?? "ecommerce";

const apiBaseUrl = () =>
  (process.env.API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

// ===================== الحفظ =====================

const saveToCloudinary = (file: Express.Multer.File): Promise<string> => {
  ensureCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: cloudinaryFolder(), resource_type: "image" },
      (err, result?: UploadApiResponse) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        resolve(result.secure_url);
      },
    );
    stream.end(file.buffer);
  });
};

const saveToDisk = async (file: Express.Multer.File): Promise<string> => {
  const ext =
    EXT_BY_MIME[file.mimetype] ??
    path.extname(file.originalname).toLowerCase() ??
    "";
  // اسم فريد يمنع تصادم الملفات، ولا يعتمد على اسم الملف الأصلي (قد يحتوي رموزًا غريبة)
  const filename = `${Date.now()}-${crypto.randomInt(1e9)}${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), file.buffer);
  return `${apiBaseUrl()}/uploads/${filename}`;
};

// يحفظ صورة واحدة ويعيد رابطها العام
export const saveImage = (file: Express.Multer.File): Promise<string> =>
  usingCloudinary() ? saveToCloudinary(file) : saveToDisk(file);

// يحفظ عدة صور. إن فشلت إحداها، تُحذف التي نجحت: لا صور يتيمة
export const saveImages = async (
  files: Express.Multer.File[],
): Promise<string[]> => {
  const results = await Promise.allSettled(files.map(saveImage));
  const saved = results.flatMap((r) =>
    r.status === "fulfilled" ? [r.value] : [],
  );
  const failed = results.find((r) => r.status === "rejected");

  if (failed) {
    await deleteImages(saved);
    throw (failed as PromiseRejectedResult).reason;
  }
  return saved;
};

// ===================== الحذف =====================

// https://res.cloudinary.com/<cloud>/image/upload/v1712345/ecommerce/abc.jpg → "ecommerce/abc"
const cloudinaryPublicId = (url: string): string | null => {
  const afterUpload = url.split("/upload/")[1];
  if (!afterUpload) return null;
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  return withoutVersion.replace(/\.[a-z0-9]+$/i, "") || null;
};

// فشل الحذف يُسجَّل ولا يُرمى: لا يجب أن يُفشل حذف منتج لأن صورته لم تُحذف
export const deleteImage = async (url: string): Promise<void> => {
  try {
    if (url.includes("res.cloudinary.com")) {
      const publicId = cloudinaryPublicId(url);
      if (!publicId) return;
      ensureCloudinary();
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      return;
    }

    if (url.includes("/uploads/")) {
      await fs.unlink(path.join(UPLOAD_DIR, path.basename(url)));
    }
  } catch (err) {
    // ملف محذوف أصلًا ليس خطأ يستحق الإزعاج
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return;
    console.error("[imageStorage] Failed to delete image:", url, err);
  }
};

export const deleteImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(deleteImage));
};
