/** @format */
import type { Request, Response } from "express";
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  type UpdateBrandInput,
} from "../services/brandService.js";
import { handleError } from "../utils/handleError.js";
import { saveImage, deleteImage } from "../utils/imageStorage.js";

// نص فقط: لا كائنات تتحول إلى شروط MongoDB
const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export const getBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await getAllBrands();
    res.status(200).json({ brands });
  } catch (err) {
    handleError(err, res);
  }
};

export const getBrand = async (req: Request, res: Response) => {
  try {
    const brand = await getBrandById(req.params.id as string);
    res.status(200).json({ brand });
  } catch (err) {
    handleError(err, res);
  }
};

export const addBrand = async (req: Request, res: Response) => {
  let image = "";
  try {
    const name = str(req.body?.name);
    const file = req.file;

    // التحقق أولًا: لا تُحفظ أي صورة لطلب ناقص
    if (!name || !file) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    image = await saveImage(file);
    const brand = await createBrand({ name, image });
    res.status(201).json({ message: "Brand created successfully", brand });
  } catch (err) {
    // فشل الإنشاء (اسم مكرر مثلًا) بعد حفظ الصورة: لم تعد مرتبطة بشيء
    if (image) await deleteImage(image);
    handleError(err, res);
  }
};

// يقبل الاسم و/أو صورة جديدة. يحتاج مسار PUT إلى upload.single("image")
// لاستقبال الصورة؛ وبدونه يعمل لتعديل الاسم فقط
export const editBrand = async (req: Request, res: Response) => {
  let newImage = "";
  try {
    // قائمة بيضاء: لا يُمرَّر req.body كما هو، فلا يمكن ضبط image برابط عشوائي
    const update: UpdateBrandInput = {};
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
    const brand = await updateBrand(req.params.id as string, update);
    res.status(200).json({ message: "Brand updated successfully", brand });
  } catch (err) {
    if (newImage) await deleteImage(newImage);
    handleError(err, res);
  }
};

export const removeBrand = async (req: Request, res: Response) => {
  try {
    await deleteBrand(req.params.id as string);
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};
