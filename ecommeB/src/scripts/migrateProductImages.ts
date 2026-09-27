/** @format */
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function migrateProductImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Mongo connected!");

    // نتعامل مع المجموعة مباشرة (لا عبر الموديل)، لأن الموديل الحالي
    // لم يعد يعرف حقل "image" القديم إطلاقًا بعد التحديث
    const collection = mongoose.connection.collection("products");

    const oldDocs = await collection
      .find({ image: { $exists: true }, images: { $exists: false } })
      .toArray();

    if (oldDocs.length === 0) {
      console.log("No products need migration. Nothing to do.");
      return;
    }

    console.log(`Found ${oldDocs.length} product(s) to migrate...`);

    for (const doc of oldDocs) {
      await collection.updateOne(
        { _id: doc._id },
        {
          $set: { images: [doc.image] }, // الصورة الواحدة تصبح أول عنصر في المصفوفة
          $unset: { image: "" }, // يزيل الحقل القديم نهائيًا
        },
      );
      console.log(`Migrated product: ${doc.name ?? doc._id}`);
    }

    console.log(`Migration complete: ${oldDocs.length} product(s) updated.`);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrateProductImages();
