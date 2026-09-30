/** @format */
import { Schema, model, type Document, type Model, type Types } from "mongoose";

export interface IAddress extends Document {
  user: Types.ObjectId;
  label: string; // "Home" أو "Work" أو أي تسمية يختارها المستخدم
  fullName: string; // اسم المستلم: قد يختلف عن اسم صاحب الحساب
  phone: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: {
      type: String,
      trim: true,
      maxlength: [30, "Label cannot exceed 30 characters"],
      default: "Home",
    },
    fullName: {
      type: String,
      required: [true, "Recipient name is required"],
      trim: true,
      maxlength: [100, "Recipient name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [60, "City cannot exceed 60 characters"],
    },
    street: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: [12, "Postal code cannot exceed 12 characters"],
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// عنوان افتراضي واحد فقط لكل مستخدم، مضمون على مستوى قاعدة البيانات نفسها:
// الفهرس الفريد يُطبَّق فقط على المستندات التي isDefault فيها true
addressSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } },
);

const Address: Model<IAddress> = model<IAddress>("Address", addressSchema);

export default Address;
