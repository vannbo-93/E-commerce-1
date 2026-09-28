/** @format */
import mongoose from "mongoose";
import Product, { type IProduct } from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";
import SubCategory from "../models/subCategoryModel.js";
import { AppError } from "../utils/AppError.js";
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

// ===================== قائمة المنتجات: بحث، فلترة، ترتيب، ترقيم =====================

export const PRODUCT_SORTS = [
  "newest",
  "price_asc",
  "price_desc",
  "rating",
] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

// _id في آخر كل ترتيب: يضمن ترتيبًا ثابتًا بين الصفحات عند تساوي السعر أو التقييم
const SORT_MAP: Record<ProductSort, Record<string, 1 | -1>> = {
  newest: { _id: -1 }, // ObjectId يبدأ بوقت الإنشاء، فلا يحتاج createdAt
  price_asc: { price: 1, _id: -1 },
  price_desc: { price: -1, _id: -1 },
  rating: { "rating.value": -1, "rating.count": -1, _id: -1 },
};

const MAX_LIMIT = 50;

export interface ProductListQuery {
  search?: string;
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean; // المنتجات التي سعرها قبل الخصم أعلى من سعرها الحالي
  sort?: ProductSort;
  page?: number;
  limit?: number; // غيابه = كل المنتجات (توافق مع صفحات الأدمن الحالية)
}

export interface ProductListResult {
  products: IProduct[];
  total: number;
  page: number;
  pages: number;
  limit: number | null;
}

// يهرّب رموز regex: بحث المستخدم عن "c++" لا يجب أن يُفسَّر كتعبير نمطي
const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toIdList = (value: unknown, label: string): string[] | undefined => {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const ids = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const id of ids) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(`Invalid ${label} id: ${id}`, 400);
    }
  }
  return ids.length > 0 ? ids : undefined;
};

const toNumber = (value: unknown, label: string): number | undefined => {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) {
    throw new AppError(`${label} must be a non-negative number`, 400);
  }
  return n;
};

const toPositiveInt = (value: unknown, label: string): number | undefined => {
  const n = toNumber(value, label);
  if (n === undefined) return undefined;
  if (!Number.isInteger(n) || n < 1) {
    throw new AppError(`${label} must be a whole number of at least 1`, 400);
  }
  return n;
};

// يحوّل req.query (نصوص فقط) إلى استعلام مُتحقَّق منه
export const parseProductListQuery = (
  query: Record<string, unknown>,
): ProductListQuery => {
  const result: ProductListQuery = {};

  if (typeof query.search === "string" && query.search.trim() !== "") {
    result.search = query.search.trim().slice(0, 100);
  }

  const categories = toIdList(query.category, "category");
  if (categories) result.categories = categories;

  const brands = toIdList(query.brand, "brand");
  if (brands) result.brands = brands;

  const minPrice = toNumber(query.minPrice, "minPrice");
  if (minPrice !== undefined) result.minPrice = minPrice;

  const maxPrice = toNumber(query.maxPrice, "maxPrice");
  if (maxPrice !== undefined) result.maxPrice = maxPrice;

  if (
    result.minPrice !== undefined &&
    result.maxPrice !== undefined &&
    result.minPrice > result.maxPrice
  ) {
    throw new AppError("minPrice cannot be greater than maxPrice", 400);
  }

  if (query.onSale === "true") result.onSale = true;

  if (typeof query.sort === "string" && query.sort !== "") {
    if (!(PRODUCT_SORTS as readonly string[]).includes(query.sort)) {
      throw new AppError(
        `sort must be one of: ${PRODUCT_SORTS.join(", ")}`,
        400,
      );
    }
    result.sort = query.sort as ProductSort;
  }

  const page = toPositiveInt(query.page, "page");
  if (page !== undefined) result.page = page;

  const limit = toPositiveInt(query.limit, "limit");
  if (limit !== undefined) result.limit = Math.min(limit, MAX_LIMIT);

  return result;
};

export const listProducts = async (
  q: ProductListQuery,
): Promise<ProductListResult> => {
  const filter: Record<string, unknown> = {};

  if (q.search) {
    filter.name = { $regex: escapeRegex(q.search), $options: "i" };
  }
  if (q.categories) filter.category = { $in: q.categories };
  if (q.brands) filter.brand = { $in: q.brands };

  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    filter.price = {
      ...(q.minPrice !== undefined ? { $gte: q.minPrice } : {}),
      ...(q.maxPrice !== undefined ? { $lte: q.maxPrice } : {}),
    };
  }

  // منتج بلا priceBeforeDiscount: المقارنة null > رقم = false، فلا يظهر
  if (q.onSale) {
    filter.$expr = { $gt: ["$priceBeforeDiscount", "$price"] };
  }

  const sort = SORT_MAP[q.sort ?? "newest"];
  const limit = q.limit ?? null;
  const page = limit === null ? 1 : (q.page ?? 1);

  let findQuery = Product.find(filter).populate(populateOptions).sort(sort);
  if (limit !== null) {
    findQuery = findQuery.skip((page - 1) * limit).limit(limit);
  }

  const [products, total] = await Promise.all([
    findQuery,
    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page,
    pages: limit === null ? 1 : Math.max(1, Math.ceil(total / limit)),
    limit,
  };
};

// ====================================================================================

// لم تعد مستخدمة في GET /product (حلّت محلها listProducts)، أبقيتها لأي كود آخر يستدعيها
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
