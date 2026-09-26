/** @format */
import { Schema, model, type Document, type Model } from "mongoose";

export interface IBrand extends Document {
  name: string;
  image: string; // رابط الصورة بعد الرفع عبر multer
}

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    image: {
      type: String,
      required: [true, "Brand image is required"],
    },
  },
  { timestamps: true },
);

const Brand: Model<IBrand> = model<IBrand>("Brand", brandSchema);

export default Brand;
