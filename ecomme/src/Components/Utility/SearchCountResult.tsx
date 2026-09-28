/** @format */

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  IconArrowsSort,
  IconCheck,
  IconChevronDown,
  IconClock,
  IconStar,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";

interface SortOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// المعرّفات تطابق حرفيًا ما يقبله GET /product?sort= في الباك إند
// لا "Best sellers": لا يوجد نظام طلبات بعد، فلا توجد بيانات مبيعات حقيقية
const SORT_OPTIONS: SortOption[] = [
  { id: "newest", label: "Newest", icon: <IconClock size={16} /> },
  { id: "rating", label: "Top rated", icon: <IconStar size={16} /> },
  {
    id: "price_asc",
    label: "Price: Low to High",
    icon: <IconSortAscending size={16} />,
  },
  {
    id: "price_desc",
    label: "Price: High to Low",
    icon: <IconSortDescending size={16} />,
  },
];

// الترتيب الذي يطبّقه الباك إند عند غياب ?sort=
const DEFAULT_SORT = "newest";

interface SearchCountResultProps {
  // null أثناء التحميل: لا نعرض رقمًا قديمًا أو صفرًا مضللًا
  total: number | null;
}

const SearchCountResult = ({ total }: SearchCountResultProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const search = searchParams.get("search")?.trim() ?? "";
  const selected = searchParams.get("sort") ?? DEFAULT_SORT;
  const selectedOption =
    SORT_OPTIONS.find((o) => o.id === selected) ?? SORT_OPTIONS[0];
  const isCustomSort = selected !== DEFAULT_SORT;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // الترتيب الافتراضي لا يُكتب في الرابط، وتغيير الترتيب يعيد للصفحة الأولى
  const handleSelect = (optionId: string) => {
    setIsOpen(false);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (optionId === DEFAULT_SORT) next.delete("sort");
      else next.set("sort", optionId);
      next.delete("page");
      return next;
    });
  };

  const title =
    total === null
      ? "Loading products..."
      : search
        ? `${total} ${total === 1 ? "result" : "results"} for "${search}"`
        : `${total} ${total === 1 ? "product" : "products"}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-5 pt-3">
      <span className="font-medium text-gray-800" aria-live="polite">
        {title}
      </span>

      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 ${
            isOpen || isCustomSort
              ? "border-sky-300 bg-sky-50 text-sky-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-sky-200 hover:bg-sky-50/60 hover:text-sky-600"
          }`}>
          <IconArrowsSort
            size={16}
            className={
              isOpen || isCustomSort ? "text-sky-500" : "text-gray-400"
            }
          />
          <span>Sort: {selectedOption?.label}</span>
          <IconChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* invisible عند الإغلاق: يُخرج الأزرار من التنقل بمفتاح Tab، لا شفافية فقط */}
        <ul
          role="listbox"
          aria-label="Sort by"
          className={`absolute right-0 top-full z-20 mt-2 min-w-[240px] origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white py-1.5
            shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-150 ${
              isOpen
                ? "visible pointer-events-auto scale-100 opacity-100"
                : "invisible pointer-events-none scale-95 opacity-0"
            }`}>
          {SORT_OPTIONS.map((option) => {
            const isSelected = selected === option.id;
            return (
              <li key={option.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? "bg-sky-50 font-medium text-sky-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  <span
                    className={isSelected ? "text-sky-500" : "text-gray-400"}>
                    {option.icon}
                  </span>
                  <span className="flex-1">{option.label}</span>
                  {isSelected && (
                    <IconCheck size={16} className="text-sky-500" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SearchCountResult;
