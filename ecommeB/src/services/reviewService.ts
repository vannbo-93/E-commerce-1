/** @format */
import mongoose from "mongoose";
import Review, { type IReview } from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import { AppError } from "../utils/appError.js";

export interface CreateReviewInput {
  product: string;
  user: string;
  rating: number;
  comment: string;
}

// يعيد حساب متوسط التقييم وعدده لمنتج معيّن، ويحدّث المستند مباشرة
const recalculateProductRating = async (productId: string) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const value = stats[0]?.avgRating ?? 0;
  const count = stats[0]?.count ?? 0;

  await Product.findByIdAndUpdate(productId, {
    rating: { value: Math.round(value * 10) / 10, count },
  });
};

export const getReviewsByProduct = async (
  productId: string,
): Promise<IReview[]> => {
  return Review.find({ product: productId })
    .populate("user", "username")
    .sort({ createdAt: -1 });
};

// للصفحة الرئيسية: أحدث التقييمات الإيجابية عبر كل المنتجات
export const getFeaturedReviews = async (limit = 3): Promise<IReview[]> => {
  return Review.find({ rating: { $gte: 4 } })
    .populate("user", "username")
    .sort({ _id: -1 }) // الأحدث أولًا؛ لا يعتمد على وجود timestamps
    .limit(limit);
};

export const createReview = async (
  data: CreateReviewInput,
): Promise<IReview> => {
  const product = await Product.findById(data.product);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  let review: IReview;
  try {
    review = await Review.create(data);
  } catch (err: unknown) {
    // الفهرس الفريد {product, user} هو الضمان الحقيقي ضد التكرار
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      throw new AppError("You have already reviewed this product", 409);
    }
    throw err;
  }

  await recalculateProductRating(data.product);
  return review.populate("user", "username");
};

export const deleteReview = async (
  reviewId: string,
  requesterId: string,
  isAdmin: boolean,
): Promise<void> => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError("Review not found", 404);
  }

  // المستخدم يحذف تعليقه الخاص فقط، إلا لو كان أدمن
  if (!isAdmin && review.user.toString() !== requesterId) {
    throw new AppError("You can only delete your own review", 403);
  }

  const productId = review.product.toString();
  await review.deleteOne();
  await recalculateProductRating(productId);
};
