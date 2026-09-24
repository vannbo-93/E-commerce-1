/** @format */

import jwt from "jsonwebtoken";

// المعلومات الأساسية التي نضعها داخل التوكن؛ لا تضع كلمة المرور أو بيانات حساسة هنا أبدًا
export interface TokenPayload {
  id: string;
  role: "user" | "admin";
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // فحص صريح بدل الاعتماد على "as string"، ليظهر خطأ واضح فورًا إن نُسي المتغير في .env
    throw new Error("Missing JWT_SECRET in environment variables");
  }

  return jwt.sign(payload, secret, { expiresIn: "7d" });
};
