/** @format */
import type { CookieOptions, Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword,
} from "../services/userService.js";
import { handleError } from "../utils/handleError.js";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 أيام، بالمللي ثانية

// نفس الخيارات للضبط والمسح: بعض المتصفحات تتجاهل المسح إن اختلفت
const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // false محليًا (http)، true عند النشر (https)
  sameSite: "lax",
});

const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, { ...cookieOptions(), maxAge: COOKIE_MAX_AGE });
};

// نص فقط: كائن مثل { "$ne": "" } في email كان سيتحول إلى شرط MongoDB
// ويطابق أول مستخدم في قاعدة البيانات (NoSQL injection)
const str = (value: unknown): string =>
  typeof value === "string" ? value : "";

export const register = async (req: Request, res: Response) => {
  try {
    const username = str(req.body?.username);
    const email = str(req.body?.email);
    const password = str(req.body?.password);

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    const { user, token } = await registerUser({ username, email, password });
    setAuthCookie(res, token);

    res.status(201).json({ message: "Account created successfully", user });
  } catch (err) {
    handleError(err, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = str(req.body?.email);
    const password = str(req.body?.password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { user, token } = await loginUser({ email, password });
    setAuthCookie(res, token);

    res.status(200).json({ message: "Logged in successfully", user });
  } catch (err) {
    handleError(err, res);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions());
  res.status(200).json({ message: "Logged out successfully" });
};

// req.user يأتي من protect middleware، ويحمل فقط id وrole؛
// نجلب هنا باقي بيانات المستخدم (username, email) من قاعدة البيانات
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await getCurrentUser(req.user!.id);
    res.status(200).json({ user });
  } catch (err) {
    handleError(err, res);
  }
};

// PATCH /user/me — تعديل الاسم
export const updateMe = async (req: Request, res: Response) => {
  try {
    const user = await updateProfile(req.user!.id, {
      username: str(req.body?.username),
    });
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    handleError(err, res);
  }
};

// PATCH /user/me/password — تغيير كلمة المرور
export const changeMyPassword = async (req: Request, res: Response) => {
  try {
    const { user, token } = await changePassword(
      req.user!.id,
      str(req.body?.currentPassword),
      str(req.body?.newPassword),
    );
    // الكوكي القديم أصبح مرفوضًا: نستبدله بالتوكن الجديد فيبقى المستخدم مسجّلًا هنا
    setAuthCookie(res, token);
    res.status(200).json({ message: "Password changed successfully", user });
  } catch (err) {
    handleError(err, res);
  }
};
