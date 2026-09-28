/** @format */
import { Schema, model, type Document, type Model } from "mongoose";
export type SubscriberStatus = "pending" | "active" | "unsubscribed";
export interface INewsletterSubscriber extends Document {
  email: string;
  // pending: لم يؤكد بعد، active: يستقبل الرسائل، unsubscribed: ألغى الاشتراك
  status: SubscriberStatus;
  confirmTokenHash?: string | undefined; // تجزئة الرمز فقط، لا الرمز نفسه
  confirmTokenExpires?: Date | undefined;
  confirmSentAt?: Date | undefined; // لمنع إغراق بريد شخص برسائل تأكيد متكررة
  confirmedAt?: Date | undefined;
  unsubscribedAt?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}
const newsletterSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true, // Ali@x.com و ali@x.com مشترك واحد لا اثنان
      maxlength: 254,
    },
    status: {
      type: String,
      enum: ["pending", "active", "unsubscribed"],
      default: "pending",
      index: true,
    },
    confirmTokenHash: { type: String, index: true, sparse: true },
    confirmTokenExpires: { type: Date },
    confirmSentAt: { type: Date },
    confirmedAt: { type: Date },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true },
);
const NewsletterSubscriber: Model<INewsletterSubscriber> =
  model<INewsletterSubscriber>("NewsletterSubscriber", newsletterSchema);
export default NewsletterSubscriber;
