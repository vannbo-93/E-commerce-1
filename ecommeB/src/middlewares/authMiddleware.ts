/** @format */
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { TokenPayload } from "../utils/generateToken.js";

// يوسّع نوع Request القياسي في Express ليقبل حقل user بعد التحقق من التوكن
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("Missing JWT_SECRET in environment variables");
    return res.status(500).json({ message: "Something went wrong" });
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = decoded; // متاح الآن لأي middleware أو controller بعده في نفس الطلب
    next();
  } catch {
    // التوكن منتهي الصلاحية أو مزوّر أو تالف
    res.status(401).json({ message: "Invalid or expired session" });
  }
};
