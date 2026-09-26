/** @format */
import { Schema, model, type Document, type Model, type Types } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  category: Types.ObjectId; // يشير إلى التصنيف الأب
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Parent category is required"],
    },
  },
  { timestamps: true },
);

// يمنع تكرار نفس الاسم تحت نفس التصنيف الأب، لكن يسمح به تحت أب مختلف
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

const SubCategory: Model<ISubCategory> = model<ISubCategory>(
  "SubCategory",
  subCategorySchema,
);

export default SubCategory;
