/** @format */
import Product, { type IProduct } from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";
import SubCategory from "../models/subCategoryModel.js";
import { AppError } from "../utils/appError.js";
import fs from "fs";
import path from "path";

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  priceBeforeDiscount?: number;
  category: string;
  subCategories?: string[];
  brand: string;
  colors?: string[];
  images: string[];
}

export type UpdateProductInput = Partial<CreateProductInput>;

// يتحقق أن التصنيف والعلامة والتصنيفات الفرعية موجودة فعليًا، بدل مراجع معطوبة
const validateReferences = async (data: {
  category?: string;
  brand?: string;
  subCategories?: string[];
}) => {
  if (data.category) {
    const exists = await Category.findById(data.category);
    if (!exists) throw new AppError("Category not found", 404);
  }

  if (data.brand) {
    const exists = await Brand.findById(data.brand);
    if (!exists) throw new AppError("Brand not found", 404);
  }

  if (data.subCategories && data.subCategories.length > 0) {
    const count = await SubCategory.countDocuments({
      _id: { $in: data.subCategories },
    });
    if (count !== data.subCategories.length) {
      throw new AppError("One or more subcategories not found", 404);
    }
  }
};

const populateOptions = [
  { path: "category", select: "name" },
  { path: "subCategories", select: "name" },
  { path: "brand", select: "name image" },
];

export const getAllProducts = async (): Promise<IProduct[]> => {
  return Product.find().populate(populateOptions).sort({ createdAt: -1 });
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const product = await Product.findById(id).populate(populateOptions);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return product;
};

export const createProduct = async (
  data: CreateProductInput,
): Promise<IProduct> => {
  await validateReferences(data);

  if (
    data.priceBeforeDiscount !== undefined &&
    data.priceBeforeDiscount < data.price
  ) {
    throw new AppError(
      "Price before discount cannot be lower than the current price",
      400,
    );
  }

  const product = await Product.create(data);
  return product.populate(populateOptions);
};

export const updateProduct = async (
  id: string,
  data: UpdateProductInput,
): Promise<IProduct> => {
  await validateReferences(data);

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate(populateOptions);

  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // يحذف كل ملفات الصور المرتبطة، لا صورة واحدة فقط
  for (const imageUrl of product.images) {
    try {
      const filename = path.basename(imageUrl);
      const filePath = path.join("uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("Failed to delete product image file:", imageUrl, err);
    }
  }
};
