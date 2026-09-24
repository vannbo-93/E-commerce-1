/** @format */
import { Schema, model, type Document, type Model } from "mongoose";
import bcrypt from "bcryptjs";

// الشكل الذي يراه بقية الكود (controllers، middlewares) عند التعامل مع مستخدم
export interface IUser extends Document {
  username: string;
  email: string;
  password: string; // يخزّن الهاش، لا كلمة المرور الصريحة أبدًا
  role: "user" | "admin";
  comparePassword: (candidate: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // يمنع تكرار البريد على مستوى قاعدة البيانات نفسها
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // لا يُرجَع تلقائيًا في أي استعلام إلا إذا طُلب صراحة
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

// يُشفّر كلمة المرور تلقائيًا قبل الحفظ، فقط إن تغيّرت فعليًا
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// دالة مساعدة للمقارنة عند تسجيل الدخول، بدل استدعاء bcrypt يدويًا في كل controller
userSchema.methods.comparePassword = function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;
