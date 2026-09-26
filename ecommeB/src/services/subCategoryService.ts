/** @format */
import SubCategory, { type ISubCategory } from "../models/subCategoryModel.js";
import Category from "../models/categoryModel.js";
import { AppError } from "../utils/AppError.js";

export interface CreateSubCategoryInput {
  name: string;
  category: string; // _id التصنيف الأب
}

export type UpdateSubCategoryInput = Partial<CreateSubCategoryInput>;

export const getAllSubCategories = async (): Promise<ISubCategory[]> => {
  // populate يجلب اسم التصنيف الأب مباشرة بدل الـ id وحده، مفيد للعرض في الواجهة
  return SubCategory.find()
    .populate("category", "name")
    .sort({ createdAt: -1 });
};

export const getSubCategoryById = async (id: string): Promise<ISubCategory> => {
  const subCategory = await SubCategory.findById(id).populate(
    "category",
    "name",
  );
  if (!subCategory) {
    throw new AppError("Subcategory not found", 404);
  }
  return subCategory;
};

export const createSubCategory = async (
  data: CreateSubCategoryInput,
): Promise<ISubCategory> => {
  // يتحقق أن التصنيف الأب موجود فعليًا قبل الربط به، بدل مرجع معطوب لتصنيف غير موجود
  const parentExists = await Category.findById(data.category);
  if (!parentExists) {
    throw new AppError("Parent category not found", 404);
  }

  const existing = await SubCategory.findOne({
    name: data.name,
    category: data.category,
  });
  if (existing) {
    throw new AppError(
      "This subcategory already exists under the selected category",
      409,
    );
  }

  const subCategory = await SubCategory.create(data);
  return subCategory.populate("category", "name");
};

export const updateSubCategory = async (
  id: string,
  data: UpdateSubCategoryInput,
): Promise<ISubCategory> => {
  if (data.category) {
    const parentExists = await Category.findById(data.category);
    if (!parentExists) {
      throw new AppError("Parent category not found", 404);
    }
  }

  const subCategory = await SubCategory.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("category", "name");

  if (!subCategory) {
    throw new AppError("Subcategory not found", 404);
  }
  return subCategory;
};

export const deleteSubCategory = async (id: string): Promise<void> => {
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    throw new AppError("Subcategory not found", 404);
  }
};
