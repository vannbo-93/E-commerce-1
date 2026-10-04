/** @format */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cachedGet } from "../../Api/cachedGet";

interface CategoryOption {
  _id: string;
  name: string;
}

// شريط تصنيفات سريع أعلى صفحة المتجر: يختار تصنيفًا واحدًا.
// يعدّل معامل category فقط في الرابط، فيبقى البحث والترتيب والماركة كما هي.
// الاختيار المتعدد متاح في SideFilter، ويكتب في نفس المعامل.
const CategoryHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const selected = searchParams.get("category") ?? "";

  useEffect(() => {
    let cancelled = false;
    cachedGet<{ categories?: CategoryOption[] }>("/category")
      .then((data) => {
        if (!cancelled) setCategories(data.categories ?? []);
      })
      .catch(() => {
        // فشل الجلب يخفي الشريط فقط، ولا يمنع عرض المنتجات
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectCategory = (categoryId: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (categoryId === "") next.delete("category");
      else next.set("category", categoryId);
      next.delete("page");
      return next;
    });
  };

  if (categories.length === 0) return null;

  const chipClass = (active: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
      active
        ? "bg-sky-500 text-white"
        : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
    }`;

  return (
    <nav
      aria-label="Product categories"
      className="flex flex-nowrap gap-3 overflow-x-auto whitespace-nowrap border-b border-gray-100 px-2 py-3">
      <button
        type="button"
        onClick={() => selectCategory("")}
        aria-pressed={selected === ""}
        className={chipClass(selected === "")}>
        All
      </button>
      {categories.map((cat) => {
        // مفعّل فقط إن كان التصنيف الوحيد المختار؛ عند اختيار عدة تصنيفات
        // من SideFilter لا يُفعَّل أي زر هنا، لأن الشريط لا يعبّر عن اختيار متعدد
        const active = selected === cat._id;
        return (
          <button
            key={cat._id}
            type="button"
            onClick={() => selectCategory(cat._id)}
            aria-pressed={active}
            className={chipClass(active)}>
            {cat.name}
          </button>
        );
      })}
    </nav>
  );
};

export default CategoryHeader;
