/** @format */
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import type { TokenPayload } from "../utils/generateToken.js";

// يوسّع نوع Request القياسي في Express ليقبل حقل user بعد التحقق من التوكن
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// iat: وقت إصدار التوكن بالثواني، تضيفه jsonwebtoken تلقائيًا لكل توكن
type DecodedToken = TokenPayload & { iat?: number };

const unauthorized = (res: Response, message = "Invalid or expired session") =>
  res.status(401).json({ message });

// يتحقق من التوكن، ثم من المستخدم في قاعدة البيانات.
// التحقق من التوكن وحده لا يكفي: لا يعرف إن حُذف المستخدم،
// أو تغيّرت كلمة مروره، أو سُحبت صلاحية الأدمن منه.
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;

  if (typeof token !== "string" || !token) {
    return unauthorized(res, "Not authenticated");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("Missing JWT_SECRET in environment variables");
    return res.status(500).json({ message: "Something went wrong" });
  }

  let decoded: DecodedToken;
  try {
    // algorithms: لا نقبل إلا الخوارزمية التي نوقّع بها فعلًا
    decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    }) as DecodedToken;
  } catch {
    // التوكن منتهي الصلاحية أو مزوّر أو تالف
    return unauthorized(res);
  }

  if (!mongoose.isValidObjectId(decoded.id)) {
    return unauthorized(res);
  }

  try {
    const user = await User.findById(decoded.id)
      .select("role passwordChangedAt")
      .lean();

    // حساب محذوف
    if (!user) {
      return unauthorized(res);
    }

    // توكن صدر قبل آخر تغيير لكلمة المرور: جلسة قديمة، ربما لمن سرق كلمة المرور السابقة
    if (
      user.passwordChangedAt &&
      decoded.iat !== undefined &&
      decoded.iat * 1000 < new Date(user.passwordChangedAt).getTime()
    ) {
      return unauthorized(
        res,
        "Your password was changed. Please log in again.",
      );
    }

    // الـ role من قاعدة البيانات لا من التوكن: سحب صلاحية الأدمن يسري فورًا
    req.user = { ...decoded, id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    console.error("[protect] Failed to load user:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
