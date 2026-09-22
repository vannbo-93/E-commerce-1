/** @format */

import { useState, useRef, useEffect } from "react";
import {
  IconArrowsSort,
  IconCheck,
  IconChevronDown,
  IconFlame,
  IconStar,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";

interface SortOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const SORT_OPTIONS: SortOption[] = [
  { id: "bestseller", label: "Best sellers", icon: <IconFlame size={16} /> },
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

interface SearchCountResultProps {
  title: string;
  onSortChange?: (sortId: string) => void;
}

const SearchCountResult = ({ title, onSortChange }: SearchCountResultProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
    setIsOpen(false);
    onSortChange?.(optionId);
  };

  const selectedOption = SORT_OPTIONS.find((o) => o.id === selected);

  return (
    <div className="flex items-center justify-between px-2 pt-3 pb-5">
      <span className="font-medium text-gray-800">{title}</span>

      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 ${
            isOpen || selectedOption
              ? "border-sky-300 bg-sky-50 text-sky-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-sky-200 hover:bg-sky-50/60 hover:text-sky-600"
          }`}>
          <IconArrowsSort
            size={16}
            className={
              isOpen || selectedOption ? "text-sky-500" : "text-gray-400"
            }
          />
          <span>{selectedOption ? selectedOption.label : "Sort by"}</span>
          <IconChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <ul
          role="listbox"
          aria-label="Sort by"
          className={`absolute right-0 top-full z-20 mt-2 min-w-[240px] origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white py-1.5 
            shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-150 ${
            isOpen
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
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
