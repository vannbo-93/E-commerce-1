/** @format */
import type { Request, Response, NextFunction } from "express";

// يجب أن يعمل هذا الـ middleware دائمًا بعد protect، لأنه يعتمد على req.user
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    // حماية إضافية: لو استُخدم هذا الـ middleware بالخطأ بدون protect قبله
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};
