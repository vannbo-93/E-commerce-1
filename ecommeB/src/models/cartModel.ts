/** @format */
import { Schema, model, type Document, type Model, type Types } from "mongoose";

export interface ICartItem {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  color?: string;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: Types.DocumentArray<ICartItem>;
  createdAt: Date;
  updatedAt: Date;
}

// كل سطر في السلة له _id خاص، لأن نفس المنتج بلونين مختلفين = سطران منفصلان
// لا نخزّن السعر هنا عمدًا: السعر يُقرأ من Product عند كل عرض، فلا يصبح قديمًا أبدًا
const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    max: [99, "Quantity cannot exceed 99"],
  },
  color: {
    type: String,
    trim: true,
  },
});

const cartSchema = new Schema<ICart>(
  {
    // سلة واحدة لكل مستخدم
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Cart: Model<ICart> = model<ICart>("Cart", cartSchema);

export default Cart;
