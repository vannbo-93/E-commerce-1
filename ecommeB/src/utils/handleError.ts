/** @format */
import type { Response } from "express";
import mongoose from "mongoose";
import { AppError } from "./AppError.js";

// معالج أخطاء موحّد للكنترولرات: أخطاء المستخدم تعود 400 لا 500
export const handleError = (err: unknown, res: Response) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors)[0]?.message ?? "Invalid data";
    return res.status(400).json({ message });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }
  console.error(err);
  return res.status(500).json({ message: "Something went wrong" });
};
