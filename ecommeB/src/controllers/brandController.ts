/** @format */
import type { Request, Response } from "express";
import { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand,
} from "../services/brandService.js";
import { AppError } from "../utils/AppError.js";

const handleError = (err: unknown, res: Response) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};

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
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const image = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const brand = await createBrand({ name, image });
    res.status(201).json({ message: "Brand created successfully", brand });
  } catch (err) {
    handleError(err, res);
  }
};

export const editBrand = async (req: Request, res: Response) => {
  try {
    const brand = await updateBrand(req.params.id as string, req.body);
    res.status(200).json({ message: "Brand updated successfully", brand });
  } catch (err) {
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
