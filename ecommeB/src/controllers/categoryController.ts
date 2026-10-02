/** @format */
import type { Request, Response } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  type UpdateCategoryInput,
} from "../services/categoryService.js";
import { handleError } from "../utils/handleError.js";
import { saveImage, deleteImage } from "../utils/imageStorage.js";

// نص فقط: لا كائنات تتحول إلى شروط MongoDB
const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

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
  let image = "";
  try {
    const name = str(req.body?.name);
    const file = req.file;

    // التحقق أولًا: لا تُحفظ أي صورة لطلب ناقص
    if (!name || !file) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    image = await saveImage(file);
    const category = await createCategory({ name, image });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (err) {
    // فشل الإنشاء (اسم مكرر مثلًا) بعد حفظ الصورة: لم تعد مرتبطة بشيء
    if (image) await deleteImage(image);
    handleError(err, res);
  }
};

// يقبل الاسم و/أو صورة جديدة. يحتاج مسار PUT إلى upload.single("image")
// لاستقبال الصورة؛ وبدونه يعمل لتعديل الاسم فقط
export const editCategory = async (req: Request, res: Response) => {
  let newImage = "";
  try {
    // قائمة بيضاء: لا يُمرَّر req.body كما هو، فلا يمكن ضبط image برابط عشوائي
    const update: UpdateCategoryInput = {};
    const name = str(req.body?.name);
    if (name) update.name = name;

    if (req.file) {
      newImage = await saveImage(req.file);
      update.image = newImage;
    }

    if (!update.name && !update.image) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // الخدمة تحذف الصورة القديمة بعد نجاح التحديث
    const category = await updateCategory(req.params.id as string, update);
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (err) {
    if (newImage) await deleteImage(newImage);
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
