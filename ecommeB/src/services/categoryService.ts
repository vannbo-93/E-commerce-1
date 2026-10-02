/** @format */
import Category, { type ICategory } from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryModel.js";
import Product from "../models/productModel.js";
import { AppError } from "../utils/AppError.js";
import { deleteImage } from "../utils/imageStorage.js";

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

  // الصورة القديمة: تُحذف بعد نجاح التحديث إن تغيّرت
  const previous = await Category.findById(id).select("image");
  if (!previous) {
    throw new AppError("Category not found", 404);
  }

  const category = await Category.findByIdAndUpdate(id, data, {
    new: true, // يُعيد المستند بعد التحديث، لا قبله
    runValidators: true, // يُطبّق قواعد الـ schema حتى عند التحديث
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // الحذف بعد نجاح التحديث لا قبله، وإلا بقي السجل يشير إلى صورة محذوفة
  if (data.image && previous.image && previous.image !== data.image) {
    await deleteImage(previous.image);
  }

  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  // يمنع حذف category له منتجات مرتبطة، بدل تركها بمرجع معطوب
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    throw new AppError(
      "Cannot delete a category that still has products. Reassign or delete those products first.",
      409,
    );
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // حذف متسلسل: يزيل كل التصنيفات الفرعية المرتبطة بهذا التصنيف الأب،
  // لمنع بقاء مراجع معطوبة تشير إلى تصنيف لم يعد موجودًا
  await SubCategory.deleteMany({ category: id });

  // يحذف الصورة أيضًا، من Cloudinary أو من القرص بحسب رابطها
  await deleteImage(category.image);
};
