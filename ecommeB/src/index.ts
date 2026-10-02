/** @format */
// أول سطر: يُحمّل .env قبل أي ملف آخر. في ES Modules تُنفَّذ كل أسطر import
// قبل كود الملف، فـ dotenv.config() في الأسفل كان يأتي بعد تحميل كل المسارات
import "dotenv/config";

import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import multer from "multer";
import userRoute from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import brandRoute from "./routes/brandRoute.js";
import subCategoryRoute from "./routes/subCategoryRoute.js";
import productRoute from "./routes/productRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import cartRoute from "./routes/cartRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import newsletterRoute from "./routes/newsletterRoute.js";
import contactRoute from "./routes/contactRoute.js";
import addressRoute from "./routes/addressRoute.js";
import orderRoute from "./routes/orderRoute.js";
import { AppError } from "./utils/AppError.js";
import { apiLimiter } from "./middlewares/rateLimiters.js";

// ===================== المتغيرات الإلزامية =====================

// فشل فوري برسالة واضحة، بدل فشل غامض لاحقًا (اتصال مرفوض، توكن لا يُوقَّع)
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"] as const;
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 3001;

// نطاقات الفرونت إند المسموح لها، مفصولة بفاصلة:
// CLIENT_ORIGIN=https://myshop.vercel.app,https://www.myshop.com
const allowedOrigins = (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const app = express();

// Render وأغلب الاستضافات تمرر الطلبات عبر وسيط (proxy).
// بدون هذا يظن Express أن الاتصال غير مشفّر، فيرفض إرسال الكوكي الآمن
if (isProduction) {
  app.set("trust proxy", 1);
}

// ترويسات أمان قياسية. crossOriginResourcePolicy: الفرونت إند على نطاق آخر
// يحتاج عرض الصور من /uploads (في التطوير، أو للصور القديمة غير المنقولة)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      // طلبات بلا origin (Postman، curl، فحص صحة Render) مسموحة:
      // الكوكي والصلاحيات تحميها، لا CORS
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new AppError(`Origin ${origin} is not allowed by CORS`, 403));
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));

// يخدم الصور المحلية (التطوير). في الإنتاج الصور على Cloudinary
app.use("/uploads", express.static("uploads"));

// ===================== المسارات =====================

// يستخدمه Render (وأي مراقبة) ليعرف أن السيرفر حي ومتصل بقاعدة البيانات
app.get("/health", (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({ status: dbReady ? "ok" : "db-down" });
});

// حد عام لكل المسارات التالية (فحص الصحة أعلاه مستثنى منه)
app.use(apiLimiter);

app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/brand", brandRoute);
app.use("/subcategory", subCategoryRoute);
app.use("/product", productRoute);
app.use("/review", reviewRoute);
app.use("/cart", cartRoute);
app.use("/wishlist", wishlistRoute);
app.use("/newsletter", newsletterRoute);
app.use("/contact", contactRoute);
app.use("/address", addressRoute);
app.use("/order", orderRoute);

// ===================== الأخطاء =====================

// أي مسار غير معرّف: JSON واضح بدل صفحة HTML الافتراضية ("Cannot GET ...")
app.use((req: Request, res: Response) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.path}` });
});

// معالج عام لما يفلت من الكنترولرات: CORS، و JSON مشوَّه، وأخطاء multer
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Malformed JSON body" });
  }
  console.error("[unhandled]", err);
  res.status(500).json({ message: "Something went wrong" });
});

// ===================== التشغيل =====================

// يبني كل الفهارس المعرّفة في الموديلات (الفريدة خصوصًا).
// Mongoose يبنيها تلقائيًا، لكنه يفشل بصمت إن وُجدت بيانات مكررة:
// هنا يظهر الفشل في الطرفية بوضوح، دون إيقاف السيرفر
const ensureIndexes = async () => {
  const results = await Promise.allSettled(
    Object.values(mongoose.models).map((model) => model.createIndexes()),
  );
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      const name = Object.values(mongoose.models)[i]?.modelName;
      console.error(`[indexes] Failed to build indexes for ${name}:`, r.reason);
    }
  });
};

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Mongo connected!");

    await ensureIndexes();

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
      console.log(`allowed origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (err) {
    console.error("Startup failed!", err);
    process.exit(1);
  }
}

start();
