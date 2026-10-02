/** @format */
import mongoose from "mongoose";
import Review, { type IReview } from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import { AppError } from "../utils/AppError.js";

export interface CreateReviewInput {
  product: string;
  user: string;
  rating: number;
  comment: string;
}

// خطأ MongoDB رقم 11000 = انتهاك فهرس فريد
const isDuplicateKeyError = (err: unknown): boolean =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  (err as { code: unknown }).code === 11000;

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

// ===================== شكل الرد =====================

type PopulatedUser = {
  _id: mongoose.Types.ObjectId;
  username: string;
  avatar?: string;
} | null;

export interface ReviewResponse {
  _id: string;
  product: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: { _id: string; username: string; avatar: string } | null;
  // كاتب التقييم استلم فعلًا طلبًا فيه هذا المنتج (حالة Delivered)
  verified: boolean;
}

type ReviewDocLike = {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  user: PopulatedUser;
};

const USER_FIELDS = "username avatar";

// "Verified Buyer" حقيقية: استعلام واحد لكل قائمة، لا استعلام لكل تقييم
const withVerified = async (
  reviews: ReviewDocLike[],
): Promise<ReviewResponse[]> => {
  const userIds = reviews.flatMap((r) => (r.user ? [r.user._id] : []));
  const productIds = reviews.map((r) => r.product);

  const delivered = userIds.length
    ? await Order.find({
        status: "delivered",
        user: { $in: userIds },
        "items.product": { $in: productIds },
      })
        .select("user items.product")
        .lean()
    : [];

  // أزواج "مستخدم:منتج" مُسلَّمة
  const purchased = new Set<string>();
  for (const order of delivered) {
    for (const item of order.items) {
      purchased.add(`${order.user.toString()}:${item.product.toString()}`);
    }
  }

  return reviews.map((r) => ({
    _id: r._id.toString(),
    product: r.product.toString(),
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    user: r.user
      ? {
          _id: r.user._id.toString(),
          username: r.user.username,
          avatar: r.user.avatar ?? "",
        }
      : null,
    verified: r.user
      ? purchased.has(`${r.user._id.toString()}:${r.product.toString()}`)
      : false,
  }));
};

export const getReviewsByProduct = async (
  productId: string,
): Promise<ReviewResponse[]> => {
  const reviews = await Review.find({ product: productId })
    .populate<{ user: PopulatedUser }>("user", USER_FIELDS)
    .sort({ createdAt: -1 })
    .lean();
  return withVerified(reviews);
};

// للصفحة الرئيسية: أحدث التقييمات الإيجابية عبر كل المنتجات
export const getFeaturedReviews = async (
  limit = 3,
): Promise<ReviewResponse[]> => {
  const reviews = await Review.find({ rating: { $gte: 4 } })
    .populate<{ user: PopulatedUser }>("user", USER_FIELDS)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return withVerified(reviews);
};

export const createReview = async (
  data: CreateReviewInput,
): Promise<ReviewResponse> => {
  const product = await Product.findById(data.product);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // لا فحص findOne مسبق: طلبان متزامنان يمرّان منه معًا (race condition).
  // الفهرس الفريد {product, user} يرفض الثاني ذريًا، ونحوّل خطأه إلى 409.
  let review: IReview;
  try {
    review = await Review.create(data);
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      throw new AppError("You have already reviewed this product", 409);
    }
    throw err;
  }

  await recalculateProductRating(data.product);

  const populated = await Review.findById(review._id)
    .populate<{ user: PopulatedUser }>("user", USER_FIELDS)
    .lean();
  const [result] = await withVerified(populated ? [populated] : []);
  if (!result) throw new AppError("Review not found", 404);
  return result;
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
