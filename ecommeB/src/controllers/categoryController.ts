/** @format */
import type { Request, Response } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService.js";
import { AppError } from "../utils/AppError.js";

// يوحّد معالجة الأخطاء بدل تكرار نفس try/catch في كل دالة
const handleError = (err: unknown, res: Response) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({ categories });
  } catch (err) {
    handleError(err, res);
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await getCategoryById(req.params.id as string);
    res.status(200).json({ category });
  } catch (err) {
    handleError(err, res);
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // رابط عام يصل عبر express.static المُعرَّف في index.ts
    const image = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const category = await createCategory({ name, image });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (err) {
    handleError(err, res);
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    const category = await updateCategory(req.params.id as string, req.body);
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (err) {
    handleError(err, res);
  }
};

export const removeCategory = async (req: Request, res: Response) => {
  try {
    await deleteCategory(req.params.id as string);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};
