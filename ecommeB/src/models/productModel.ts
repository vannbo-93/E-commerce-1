/** @format */
import { Schema, model, type Document, type Model, type Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  priceBeforeDiscount?: number;
  category: Types.ObjectId;
  subCategories: Types.ObjectId[];
  brand: Types.ObjectId;
  colors: string[];
  images: string[];
  rating: { value: number; count: number };
  // الكمية المتوفرة: تُخصم عند إنشاء الطلب، وتُعاد عند إلغائه
  stock: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    priceBeforeDiscount: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Main category is required"],
    },
    subCategories: {
      type: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
      default: [],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
    colors: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      required: [true, "At least one product image is required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one product image is required",
      },
    },
    rating: {
      value: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number",
      },
    },
  },
  { timestamps: true },
);

const Product: Model<IProduct> = model<IProduct>("Product", productSchema);

export default Product;
