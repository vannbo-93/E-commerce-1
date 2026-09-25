/** @format */
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import { getRequiredEnv } from "../utils/getRequiredEnv.js";
dotenv.config();
async function seedAdmin() {
  try {
    // القراءة والتحقق يحدثان هنا، داخل الدالة نفسها، فتُرجع دائمًا string مضمونة
    const ADMIN_USERNAME = getRequiredEnv("ADMIN_USERNAME");
    const ADMIN_EMAIL = getRequiredEnv("ADMIN_EMAIL");
    const ADMIN_PASSWORD = getRequiredEnv("ADMIN_PASSWORD");

    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Mongo connected!");
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    // إن كان الحساب موجودًا بالفعل لكن ليس أدمن، رقّه بدل إنشاء نسخة مكررة
    if (existing) {
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
        console.log(`Promoted existing user "${ADMIN_EMAIL}" to admin.`);
      } else {
        console.log(`Admin "${ADMIN_EMAIL}" already exists. Nothing to do.`);
      }
    } else {
      // كلمة المرور تُشفَّر تلقائيًا هنا عبر نفس pre("save") hook في userModel.ts
      await User.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });
      console.log(`Admin account created: ${ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error("Failed to seed admin:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}
seedAdmin();
