/** @format */
import type { Request, Response } from "express";
import {
  getReviewsByProduct,
  getFeaturedReviews,
  createReview,
  deleteReview,
} from "../services/reviewService.js";
import { AppError } from "../utils/appError.js";

const handleError = (err: unknown, res: Response) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await getReviewsByProduct(req.params.productId as string);
    res.status(200).json({ reviews });
  } catch (err) {
    handleError(err, res);
  }
};

// يُستخدم في الصفحة الرئيسية: أفضل التقييمات من كل المنتجات
export const getFeatured = async (_req: Request, res: Response) => {
  try {
    const reviews = await getFeaturedReviews();
    res.status(200).json({ reviews });
  } catch (err) {
    handleError(err, res);
  }
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId as string;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    const review = await createReview({
      product: productId,
      user: req.user!.id,
      rating: Number(rating),
      comment: String(comment),
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    handleError(err, res);
  }
};

export const removeReview = async (req: Request, res: Response) => {
  try {
    await deleteReview(
      req.params.id as string,
      req.user!.id,
      req.user!.role === "admin",
    );
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};
