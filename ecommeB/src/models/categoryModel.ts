/** @format */
import { Schema, model, type Document, type Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  image: string; // رابط الصورة بعد الرفع (multer أو خدمة خارجية)، لا الملف نفسه
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true, // يمنع تكرار نفس اسم التصنيف
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
  },
  { timestamps: true },
);

const Category: Model<ICategory> = model<ICategory>("Category", categorySchema);

export default Category;
