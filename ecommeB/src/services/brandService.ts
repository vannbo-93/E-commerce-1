/** @format */
import Brand, { type IBrand } from "../models/brandModel.js";
import { AppError } from "../utils/AppError.js";
import fs from "fs";
import path from "path";

export interface CreateBrandInput {
  name: string;
  image: string;
}

export type UpdateBrandInput = Partial<CreateBrandInput>;

export const getAllBrands = async (): Promise<IBrand[]> => {
  return Brand.find().sort({ createdAt: -1 });
};

export const getBrandById = async (id: string): Promise<IBrand> => {
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new AppError("Brand not found", 404);
  }
  return brand;
};

export const createBrand = async (data: CreateBrandInput): Promise<IBrand> => {
  const existing = await Brand.findOne({ name: data.name });
  if (existing) {
    throw new AppError("Brand name already exists", 409);
  }
  return Brand.create(data);
};

export const updateBrand = async (
  id: string,
  data: UpdateBrandInput,
): Promise<IBrand> => {
  if (data.name) {
    const existing = await Brand.findOne({ name: data.name, _id: { $ne: id } });
    if (existing) {
      throw new AppError("Brand name already exists", 409);
    }
  }

  const brand = await Brand.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }
  return brand;
};

export const deleteBrand = async (id: string): Promise<void> => {
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  // يحذف الملف الفعلي أيضًا، لا فقط سجل قاعدة البيانات
  try {
    const filename = path.basename(brand.image);
    const filePath = path.join("uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Failed to delete brand image file:", err);
  }
};
