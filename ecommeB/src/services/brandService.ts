/** @format */
import Brand, { type IBrand } from "../models/brandModel.js";
import Product from "../models/productModel.js";
import { AppError } from "../utils/AppError.js";
import { deleteImage } from "../utils/imageStorage.js";

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
    const existing = await Brand.findOne({
      name: data.name,
      _id: { $ne: id },
    });
    if (existing) {
      throw new AppError("Brand name already exists", 409);
    }
  }

  // الصورة القديمة: تُحذف بعد نجاح التحديث إن تغيّرت
  const previous = await Brand.findById(id).select("image");
  if (!previous) {
    throw new AppError("Brand not found", 404);
  }

  const brand = await Brand.findByIdAndUpdate(id, data, {
    new: true, // يُعيد المستند بعد التحديث، لا قبله
    runValidators: true, // يُطبّق قواعد الـ schema حتى عند التحديث
  });

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  // الحذف بعد نجاح التحديث لا قبله، وإلا بقي السجل يشير إلى صورة محذوفة
  if (data.image && previous.image && previous.image !== data.image) {
    await deleteImage(previous.image);
  }

  return brand;
};

export const deleteBrand = async (id: string): Promise<void> => {
  // يمنع حذف brand له منتجات مرتبطة، بدل تركها بمرجع معطوب
  const productCount = await Product.countDocuments({ brand: id });
  if (productCount > 0) {
    throw new AppError(
      "Cannot delete a brand that still has products. Reassign or delete those products first.",
      409,
    );
  }

  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  // يحذف الصورة أيضًا، من Cloudinary أو من القرص بحسب رابطها
  await deleteImage(brand.image);
};
