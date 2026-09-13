/** @format */

import { useState, useRef, useEffect } from "react";
import sort from "../../images/sort.png";

interface SearchCountResultProps {
  title: string;
}

const SORT_OPTIONS = [
  { id: "bestseller", label: "Best sellers" },
  { id: "rating", label: "Top rated" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
];

const SearchCountResult = ({ title }: SearchCountResultProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها — ضروري بما أنها لم تعد تعتمد على hover فقط
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

  return (
    <div className="flex justify-between items-center pt-3 px-2">
      <div className="sub-tile font-medium text-gray-800">{title}</div>

      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200
                     text-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300
                     transition-colors duration-150 shadow-sm">
          <img width={18} height={18} src={sort} alt="sort" />
          <span>Sort by</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          className={`absolute top-full mt-2 right-0 z-20 min-w-[220px]
                      bg-white rounded-xl shadow-lg border border-gray-100 py-1
                      origin-top-right transition-all duration-150
                      ${
                        isOpen
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}>
          {SORT_OPTIONS.map((option) => (
            <div
              key={option.id}
              onClick={() => {
                setSelected(option.id);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                          ${
                            selected === option.id
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}>
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchCountResult;
