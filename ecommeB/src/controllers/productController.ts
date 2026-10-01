/** @format */
import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  listProducts,
  parseProductListQuery,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  type UpdateProductInput,
} from "../services/productService.js";
import { handleError } from "../utils/handleError.js";
import { AppError } from "../utils/AppError.js";

// subCategories وcolors تصلان كنص JSON عبر multipart/form-data (لا يدعم مصفوفات متداخلة مباشرة)
const parseJsonArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  try {
    const parsed = JSON.parse(value as string);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

// المخزون: عدد صحيح غير سالب. غيابه في الإضافة = 0، وفي التعديل = بلا تغيير
const parseStock = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw new AppError("Stock must be a whole number of 0 or more", 400);
  }
  return n;
};

const toImageUrl = (req: Request, file: Express.Multer.File) =>
  `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

// يحذف ملفات صور من القرص؛ الفشل يُسجَّل ولا يوقف الطلب
const deleteImageFiles = (imageUrls: string[], context: string) => {
  for (const imageUrl of imageUrls) {
    try {
      const filePath = path.join("uploads", path.basename(imageUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete ${context}:`, imageUrl, err);
    }
  }
};

// GET /product?search=&category=&brand=&minPrice=&maxPrice=&sort=&page=&limit=
// بدون limit يعيد كل المنتجات، كما كان سابقًا (لوحة الأدمن تعتمد على ذلك)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const query = parseProductListQuery(req.query as Record<string, unknown>);
    const result = await listProducts(query);
    res.status(200).json(result);
  } catch (err) {
    handleError(err, res);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id as string);
    res.status(200).json({ product });
  } catch (err) {
    handleError(err, res);
  }
};

export const addProduct = async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  try {
    const { name, description, price, priceBeforeDiscount, category, brand } =
      req.body;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !brand ||
      files.length === 0
    ) {
      deleteImageFiles(
        files.map((f) => toImageUrl(req, f)),
        "uploaded image",
      );
      return res.status(400).json({
        message:
          "Name, description, price, category, brand and at least one image are required",
      });
    }

    const stock = parseStock(req.body.stock);

    const product = await createProduct({
      ...(stock !== undefined ? { stock } : {}),
      name: String(name),
      description: String(description),
      price: Number(price),
      category: String(category),
      brand: String(brand),
      subCategories: parseJsonArray(req.body.subCategories),
      colors: parseJsonArray(req.body.colors),
      images: files.map((f) => toImageUrl(req, f)),
      ...(priceBeforeDiscount
        ? { priceBeforeDiscount: Number(priceBeforeDiscount) }
        : {}),
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    // فشل الإنشاء: الملفات التي رفعها multer لم تعد مرتبطة بأي منتج
    deleteImageFiles(
      files.map((f) => toImageUrl(req, f)),
      "uploaded image",
    );
    handleError(err, res);
  }
};

export const editProduct = async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const newImages = files.map((f) => toImageUrl(req, f));

  try {
    const existingProduct = await getProductById(req.params.id as string);

    // نقبل فقط روابط من صور المنتج الحالية، لا أي رابط يرسله الطلب
    const keptImages = parseJsonArray(req.body.existingImages).filter((img) =>
      existingProduct.images.includes(img),
    );
    const finalImages = [...keptImages, ...newImages];

    if (finalImages.length === 0) {
      deleteImageFiles(newImages, "uploaded image");
      return res
        .status(400)
        .json({ message: "At least one product image is required" });
    }

    // قائمة بيضاء: الحقول المسموح بتعديلها فقط، فلا يمكن تمرير rating أو غيره
    const body = req.body as Record<string, unknown>;
    const update: UpdateProductInput = { images: finalImages };
    if (body.name) update.name = String(body.name);
    if (body.description) update.description = String(body.description);
    if (body.price) update.price = Number(body.price);
    // الحقل يُرسَل دائمًا من صفحة التعديل: فارغ = أزل الخصم، رقم = خصم جديد.
    // غيابه تمامًا (طلب من مصدر آخر) = لا تغيير
    if (body.priceBeforeDiscount === "") {
      update.clearPriceBeforeDiscount = true;
    } else if (body.priceBeforeDiscount !== undefined) {
      update.priceBeforeDiscount = Number(body.priceBeforeDiscount);
    }
    if (body.category) update.category = String(body.category);
    if (body.brand) update.brand = String(body.brand);
    if (body.subCategories)
      update.subCategories = parseJsonArray(body.subCategories);
    if (body.colors) update.colors = parseJsonArray(body.colors);
    const stock = parseStock(body.stock);
    if (stock !== undefined) update.stock = stock;

    const product = await updateProduct(req.params.id as string, update);

    // الحذف من القرص بعد نجاح التحديث فقط، لا قبله:
    // لو فشل التحديث لبقيت قاعدة البيانات تشير إلى صور محذوفة
    const removedImages = existingProduct.images.filter(
      (img) => !keptImages.includes(img),
    );
    deleteImageFiles(removedImages, "removed product image");

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    // فشل التحديث: الصور الجديدة لم تُربط بالمنتج، والقديمة لم تُمسّ
    deleteImageFiles(newImages, "uploaded image");
    handleError(err, res);
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  try {
    await deleteProduct(req.params.id as string);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};
