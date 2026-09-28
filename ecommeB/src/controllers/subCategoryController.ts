/** @format */
import type { Request, Response } from "express";
import {
  getAllSubCategories,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../services/subCategoryService.js";
import { AppError } from "../utils/AppError.js";

const handleError = (err: unknown, res: Response) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};

export const getSubCategories = async (_req: Request, res: Response) => {
  try {
    const subCategories = await getAllSubCategories();
    res.status(200).json({ subCategories });
  } catch (err) {
    handleError(err, res);
  }
};

export const getSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategory = await getSubCategoryById(req.params.id as string);
    res.status(200).json({ subCategory });
  } catch (err) {
    handleError(err, res);
  }
};

export const addSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res
        .status(400)
        .json({ message: "Name and parent category are required" });
    }

    const subCategory = await createSubCategory({ name, category });
    res
      .status(201)
      .json({ message: "Subcategory created successfully", subCategory });
  } catch (err) {
    handleError(err, res);
  }
};

export const editSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategory = await updateSubCategory(
      req.params.id as string,
      req.body,
    );
    res
      .status(200)
      .json({ message: "Subcategory updated successfully", subCategory });
  } catch (err) {
    handleError(err, res);
  }
};

export const removeSubCategory = async (req: Request, res: Response) => {
  try {
    await deleteSubCategory(req.params.id as string);
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};
