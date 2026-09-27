/** @format */
import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService.js";
import { AppError } from "../utils/appError.js";

const handleError = (err: unknown, res: Response) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};

// subCategories وcolors تصلان كنص JSON عبر multipart/form-data (لا يدعم مصفوفات متداخلة مباشرة)
const parseJsonArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value as string[];
  try {
    const parsed = JSON.parse(value as string);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({ products });
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
  try {
    const { name, description, price, priceBeforeDiscount, category, brand } =
      req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !brand ||
      !files?.length
    ) {
      return res.status(400).json({
        message:
          "Name, description, price, category, brand and at least one image are required",
      });
    }

    const images = files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    );

    const product = await createProduct({
      name: String(name),
      description: String(description),
      price: Number(price),
      category: String(category),
      brand: String(brand),
      subCategories: parseJsonArray(req.body.subCategories),
      colors: parseJsonArray(req.body.colors),
      images,
      ...(priceBeforeDiscount
        ? { priceBeforeDiscount: Number(priceBeforeDiscount) }
        : {}),
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    handleError(err, res);
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const existingProduct = await getProductById(req.params.id as string);
    const files = req.files as Express.Multer.File[] | undefined;

    // existingImages: قائمة روابط الصور القديمة التي يريد الأدمن الإبقاء عليها (JSON string)
    const keptImages = parseJsonArray(req.body.existingImages);
    const newImages = (files ?? []).map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    );
    const finalImages = [...keptImages, ...newImages];

    if (finalImages.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one product image is required" });
    }

    // يحذف من القرص أي صورة قديمة لم تعد ضمن القائمة المحتفَظ بها
    const removedImages = existingProduct.images.filter(
      (img) => !keptImages.includes(img),
    );
    for (const imageUrl of removedImages) {
      try {
        const filename = path.basename(imageUrl);
        const filePath = path.join("uploads", filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete removed product image:", imageUrl, err);
      }
    }

    const body: Record<string, unknown> = { ...req.body, images: finalImages };
    delete body.existingImages;
    if (body.subCategories)
      body.subCategories = parseJsonArray(body.subCategories as string);
    if (body.colors) body.colors = parseJsonArray(body.colors as string);
    if (body.price) body.price = Number(body.price);
    if (body.priceBeforeDiscount)
      body.priceBeforeDiscount = Number(body.priceBeforeDiscount);

    const product = await updateProduct(req.params.id as string, body);
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
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
