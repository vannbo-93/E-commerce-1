/** @format */
import Category, { type ICategory } from "../models/categoryModel.js";
import { AppError } from "../utils/AppError.js";
import fs from "fs";
import path from "path";

export interface CreateCategoryInput {
  name: string;
  image: string;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export const getAllCategories = async (): Promise<ICategory[]> => {
  return Category.find().sort({ createdAt: -1 });
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category;
};

export const createCategory = async (
  data: CreateCategoryInput,
): Promise<ICategory> => {
  const existing = await Category.findOne({ name: data.name });
  if (existing) {
    throw new AppError("Category name already exists", 409);
  }
  return Category.create(data);
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryInput,
): Promise<ICategory> => {
  if (data.name) {
    const existing = await Category.findOne({
      name: data.name,
      _id: { $ne: id },
    });
    if (existing) {
      throw new AppError("Category name already exists", 409);
    }
  }

  const category = await Category.findByIdAndUpdate(id, data, {
    new: true, // يُعيد المستند بعد التحديث، لا قبله
    runValidators: true, // يُطبّق قواعد الـ schema (minlength وغيرها) حتى عند التحديث
  });
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  // يحذف الملف الفعلي أيضًا، لا فقط سجل قاعدة البيانات، لمنع بقايا صور يتيمة
  try {
    const filename = path.basename(category.image);
    const filePath = path.join("uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    // لا نُفشل عملية الحذف كاملة بسبب فشل حذف الملف فقط؛ نسجّله فقط للمراجعة
    console.error("Failed to delete category image file:", err);
  }
};
