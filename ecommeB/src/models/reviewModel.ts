/** @format */
import { Schema, model, type Document, type Model, type Types } from "mongoose";

export interface IReview extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

// مستخدم واحد لا يستطيع تقييم نفس المنتج أكثر من مرة
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review: Model<IReview> = model<IReview>("Review", reviewSchema);

export default Review;
