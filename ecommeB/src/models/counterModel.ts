/** @format */
import { Schema, model, type Model } from "mongoose";

interface ICounter {
  _id: string; // اسم العدّاد، مثل "order"
  seq: number;
}

const counterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false },
);

const Counter: Model<ICounter> = model<ICounter>("Counter", counterSchema);

// $inc ذري: طلبان متزامنان لا يحصلان على نفس الرقم أبدًا
export const nextSequence = async (name: string): Promise<number> => {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true, new: true },
  );
  return counter.seq;
};

export default Counter;
