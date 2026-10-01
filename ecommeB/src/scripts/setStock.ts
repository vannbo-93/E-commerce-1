/** @format */
// يعطي كل منتج مخزونه 0 أو غير موجود كمية افتراضية.
// التشغيل:  npm run set:stock          ← يضع 20 لكل منتج نافد
//           npm run set:stock -- 50    ← يضع 50 بدلًا من 20
// لا يغيّر المنتجات التي لها مخزون أصلًا.
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/productModel.js";

dotenv.config();

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
  }

  const amount = Number(process.argv[2] ?? 20);
  if (!Number.isInteger(amount) || amount < 0) {
    console.error("Stock must be a whole number, e.g. npm run set:stock -- 20");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const result = await Product.updateMany(
    { $or: [{ stock: { $exists: false } }, { stock: { $lte: 0 } }] },
    { $set: { stock: amount } },
  );
  console.log(
    `Updated ${result.modifiedCount} product(s) to stock = ${amount}\n`,
  );

  // جدول بمخزون كل المنتجات بعد التحديث
  const products = await Product.find()
    .select("name stock")
    .sort({ name: 1 })
    .lean();
  console.table(products.map((p) => ({ name: p.name, stock: p.stock })));

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
