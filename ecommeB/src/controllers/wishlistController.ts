/** @format */
import type { Request, Response } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService.js";
import { handleError } from "../utils/HandleError.js";

// كل المسارات خلف protect، فـ req.user موجود دائمًا هنا

export const getMyWishlist = async (req: Request, res: Response) => {
  try {
    const products = await getWishlist(req.user!.id);
    res.status(200).json({ products });
  } catch (err) {
    handleError(err, res);
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const productIds = await addToWishlist(
      req.user!.id,
      req.params.productId as string,
    );
    res.status(200).json({ productIds });
  } catch (err) {
    handleError(err, res);
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  try {
    const productIds = await removeFromWishlist(
      req.user!.id,
      req.params.productId as string,
    );
    res.status(200).json({ productIds });
  } catch (err) {
    handleError(err, res);
  }
};
