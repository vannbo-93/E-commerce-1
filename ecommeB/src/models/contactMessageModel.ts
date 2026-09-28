/** @format */
import { Schema, model, type Document, type Model } from "mongoose";

export type ContactMessageStatus = "new" | "read" | "archived";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    subject: { type: String, trim: true, maxlength: 150, default: "" },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 5000,
    },
    // لصفحة الأدمن لاحقًا: new = لم تُقرأ بعد
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

const ContactMessage: Model<IContactMessage> = model<IContactMessage>(
  "ContactMessage",
  contactMessageSchema,
);

export default ContactMessage;
