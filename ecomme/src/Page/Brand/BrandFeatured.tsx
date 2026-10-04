/** @format */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SubTitle from "../../Components/Utility/SubTitle";
import { cachedGet } from "../../Api/cachedGet";
import { optimizeImage } from "@/utils/cloudinary";

interface Brand {
  _id: string;
  name: string;
  image: string;
}

interface BrandFeaturedProps {
  title?: string;
  // لم يعودا مستخدمين (زر "View All" حُذف)؛ مقبولان فقط حتى لا يكسر HomePage الحالي
  btntitle?: string;
  pathText?: string;
}

// ثوانٍ لكل ماركة: السرعة ثابتة مهما كان عددها
const SECONDS_PER_BRAND = 3;
// أقل عدد عناصر في نصف الشريط: مع ماركات قليلة نكررها حتى يمتلئ العرض
const MIN_ITEMS = 8;

// الحركة: الشريط فيه نسختان متطابقتان من القائمة، ويتحرك بمقدار نصف عرضه
// (نسخة كاملة)، ثم يعود لنقطة البداية. النسخة الثانية تكون حينها مكان الأولى بالضبط،
// فلا تظهر أي قفزة. يتوقف عند المرور بالماوس أو التركيز بلوحة المفاتيح.
// prefers-reduced-motion: من فعّل "تقليل الحركة" في نظامه يرى شريطًا ثابتًا يُمرَّر يدويًا
const marqueeStyles = `
@keyframes brand-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.brand-marquee-track {
  animation: brand-marquee var(--marquee-duration) linear infinite;
}
.brand-marquee:hover .brand-marquee-track,
.brand-marquee:focus-within .brand-marquee-track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .brand-marquee { overflow-x: auto; }
  .brand-marquee-track { animation: none; }
}
`;

const BrandFeatured = ({ title }: BrandFeaturedProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    let cancelled = false;
    cachedGet<{ brands?: Brand[] }>("/brand")
      .then((data) => {
        if (!cancelled) setBrands(data.brands ?? []);
      })
      .catch(() => {
        // فشل الجلب يخفي القسم فقط
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (brands.length === 0) return null;

  // نصف الشريط: الماركات مكررة حتى MIN_ITEMS على الأقل
  const repeats = Math.ceil(MIN_ITEMS / brands.length);
  const half = Array.from({ length: repeats }, () => brands).flat();
  const duration = `${half.length * SECONDS_PER_BRAND}s`;

  const renderItem = (brand: Brand, index: number, isCopy: boolean) => (
    <Link
      key={`${isCopy ? "copy" : "main"}-${brand._id}-${index}`}
      to={`/products?brand=${brand._id}`}
      // النسخة المكررة مخفية عن قارئات الشاشة ولوحة المفاتيح: تُقرأ كل ماركة مرة واحدة
      {...(isCopy || index >= brands.length
        ? { "aria-hidden": true, tabIndex: -1 }
        : { "aria-label": `Shop ${brand.name}` })}
      className="flex h-16 w-36 shrink-0 items-center justify-center px-4 transition-all duration-200
        group-hover:opacity-50 hover:opacity-100! hover:scale-110 focus-visible:opacity-100! focus-visible:scale-110
        focus-visible:outline-none">
      <img
        src={optimizeImage(brand.image, 240)}
        alt={brand.name}
        loading="lazy"
        draggable={false}
        className="max-h-10 max-w-full object-contain"
      />
    </Link>
  );

  return (
    <section className="w-full">
      <style>{marqueeStyles}</style>

      {title ? <SubTitle title={title} /> : null}

      <div
        className="brand-marquee group relative overflow-hidden py-2"
        // حواف باهتة: الماركات تظهر وتختفي تدريجيًا بدل القطع الحاد
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}>
        <div
          className="brand-marquee-track flex w-max"
          style={{ ["--marquee-duration" as string]: duration }}>
          {half.map((b, i) => renderItem(b, i, false))}
          {half.map((b, i) => renderItem(b, i, true))}
        </div>
      </div>
    </section>
  );
};

export default BrandFeatured;
