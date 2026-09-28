/** @format */
import User, { type IUser } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { AppError } from "../utils/AppError.js";

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// الشكل الآمن للمستخدم الذي نُعيده للفرونت إند، بلا كلمة المرور أبدًا
interface SafeUser {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

const toSafeUser = (user: IUser): SafeUser => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  role: user.role,
});

export const registerUser = async (
  data: RegisterInput,
): Promise<{ user: SafeUser; token: string }> => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  // كلمة المرور تُشفَّر تلقائيًا هنا عبر الـ pre("save") hook داخل userModel.ts
  const user = await User.create(data);

  const token = generateToken({ id: user._id.toString(), role: user.role });

  return { user: toSafeUser(user), token };
};

export const loginUser = async (
  data: LoginInput,
): Promise<{ user: SafeUser; token: string }> => {
  // password مطلوبة صراحة هنا لأنها select: false في الموديل
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    // رسالة عامة متعمّدة: لا تكشف إن كان البريد موجودًا أصلًا أم لا
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({ id: user._id.toString(), role: user.role });

  return { user: toSafeUser(user), token };
};

// يُستخدم من مسار /me: التوكن يحمل فقط id وrole، فنجلب باقي البيانات من قاعدة البيانات
export const getCurrentUser = async (id: string): Promise<SafeUser> => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toSafeUser(user);
};
