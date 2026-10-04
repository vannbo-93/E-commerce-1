/** @format */
import { useEffect, useState } from "react";
import SubTitle from "../Utility/SubTitle";
import CategoryCard from "../../Page/Category/CategoryCard";
import { cachedGet } from "../../Api/cachedGet";

interface Category {
  _id: string;
  name: string;
  image: string;
}

// عدد التصنيفات في الصفحة الرئيسية؛ البقية عبر "View All Category"
const MAX_HOME_CATEGORIES = 6;

// التصنيفات من قاعدة البيانات: أي تصنيف يضيفه الأدمن يظهر هنا تلقائيًا
const HomeCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    cachedGet<{ categories?: Category[] }>("/category")
      .then((data) => {
        if (!cancelled) {
          setCategories((data.categories ?? []).slice(0, MAX_HOME_CATEGORIES));
        }
      })
      .catch(() => {
        // فشل الجلب يخفي القسم فقط، ولا يكسر الصفحة الرئيسية
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <>
      <SubTitle
        title="Shop by Category"
        btnTitle="View All Category"
        pathText="/allcategory"
      />
      <div className="mx-4 my-2 flex flex-wrap items-start justify-center gap-6 md:mx-12 md:justify-between">
        {categories.map((cat) => (
          <CategoryCard
            key={cat._id}
            id={cat._id}
            title={cat.name}
            img={cat.image}
          />
        ))}
      </div>
    </>
  );
};

export default HomeCategory;
