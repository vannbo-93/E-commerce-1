/** @format */
import type { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/userService.js";
import { AppError } from "../utils/AppError.js";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 أيام، بالمللي ثانية

// يضبط الكوكي بنفس الإعدادات في كلا المسارين، فلا تتكرر الخيارات مرتين
const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false محليًا (http)، true عند النشر (https)
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    const { user, token } = await registerUser({ username, email, password });
    setAuthCookie(res, token);

    res.status(201).json({ message: "Account created successfully", user });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error("Register error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { user, token } = await loginUser({ email, password });
    setAuthCookie(res, token);

    res.status(200).json({ message: "Logged in successfully", user });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

// req.user يأتي من protect middleware، ويحمل فقط id وrole (المحتوى التوكن)؛
// نجلب هنا باقي بيانات المستخدم (username, email) من قاعدة البيانات
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await getCurrentUser(req.user!.id);
    res.status(200).json({ user });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
