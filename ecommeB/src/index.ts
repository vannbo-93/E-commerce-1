/** @format */
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import brandRoute from "./routes/brandRoute.js";
import subCategoryRoute from "./routes/subCategoryRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

// يخدم الصور المرفوعة عبر multer كملفات ثابتة، مثال: /uploads/169..-image.png
app.use("/uploads", express.static("uploads"));

app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/brand", brandRoute);
app.use("/subcategory", subCategoryRoute);

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Mongo connected!");
    app.listen(PORT, () =>
      console.log(`server is running at : http://localhost:${PORT}`),
    );
  } catch (err) {
    console.error("Failed to connect!", err);
    process.exit(1);
  }
}

start();
