/** @format */
import mongoose from "mongoose";
import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";
import { AppError } from "../utils/AppError.js";

// نفس ما تحتاجه ProductCard في الفرونت إند
export interface WishlistProductResponse {
  _id: string;
  name: string;
  price: number;
  priceBeforeDiscount: number | null;
  image: string | null;
  hasOptions: boolean;
  rating: { value: number; count: number };
}

const assertValidProductId = (productId: string) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new AppError("Invalid product id", 400);
  }
};

const getIds = async (userId: string): Promise<string[]> => {
  const wishlist = await Wishlist.findOne({ user: userId })
    .select("products")
    .lean();
  return (wishlist?.products ?? []).map((id) => id.toString());
};

export const getWishlist = async (
  userId: string,
): Promise<WishlistProductResponse[]> => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist || wishlist.products.length === 0) return [];

  const products = await Product.find({ _id: { $in: wishlist.products } })
    .select("name price priceBeforeDiscount images colors rating")
    .lean();

  const byId = new Map(products.map((p) => [p._id.toString(), p]));

  // منتج حُذف من المتجر بعد إضافته للمفضلة: نزيله بصمت
  const staleIds = wishlist.products.filter((id) => !byId.has(id.toString()));
  if (staleIds.length > 0) {
    await Wishlist.updateOne(
      { user: userId },
      { $pull: { products: { $in: staleIds } } },
    );
  }

  // الأحدث إضافةً أولًا
  const result: WishlistProductResponse[] = [];
  for (const id of [...wishlist.products].reverse()) {
    const p = byId.get(id.toString());
    if (!p) continue;
    result.push({
      _id: p._id.toString(),
      name: p.name,
      price: p.price,
      priceBeforeDiscount: p.priceBeforeDiscount ?? null,
      image: p.images[0] ?? null,
      hasOptions: p.colors.length > 0,
      rating: {
        value: p.rating?.value ?? 0,
        count: p.rating?.count ?? 0,
      },
    });
  }
  return result;
};

// $addToSet: إضافة نفس المنتج مرتين لا تكرره، فالطلب آمن للتكرار
export const addToWishlist = async (
  userId: string,
  productId: string,
): Promise<string[]> => {
  assertValidProductId(productId);

  const exists = await Product.exists({ _id: productId });
  if (!exists) {
    throw new AppError("Product not found", 404);
  }

  await Wishlist.updateOne(
    { user: userId },
    { $addToSet: { products: productId } },
    { upsert: true },
  );
  return getIds(userId);
};

// $pull: حذف منتج غير موجود لا يرمي خطأ، فالطلب آمن للتكرار أيضًا
export const removeFromWishlist = async (
  userId: string,
  productId: string,
): Promise<string[]> => {
  assertValidProductId(productId);

  await Wishlist.updateOne(
    { user: userId },
    { $pull: { products: productId } },
  );
  return getIds(userId);
};
