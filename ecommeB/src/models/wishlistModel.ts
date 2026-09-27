/** @format */
import { Schema, model, type Document, type Model, type Types } from "mongoose";

export interface IWishlist extends Document {
  user: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    // قائمة مفضلة واحدة لكل مستخدم
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // مصفوفة معرّفات فقط: السعر والاسم يُقرآن من Product عند العرض
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true },
);

const Wishlist: Model<IWishlist> = model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
