/** @format */
import { useId, useState, type ChangeEvent } from "react";
import {
  IconDeviceLaptop,
  IconPercentage,
  IconShirt,
  IconSparkles,
  IconWashMachine,
  IconX,
} from "@tabler/icons-react";

const categories = [
  { id: "all", label: "All", icon: <IconSparkles size={16} /> },
  {
    id: "home_appliances",
    label: "Home Appliances",
    icon: <IconWashMachine size={16} />,
  },
  {
    id: "electronics",
    label: "Electronics",
    icon: <IconDeviceLaptop size={16} />,
  },
  { id: "clothes", label: "Clothes", icon: <IconShirt size={16} /> },
  { id: "sales", label: "Discounts", icon: <IconPercentage size={16} /> },
];

const brands = [
  { id: "all", label: "All" },
  { id: "apple", label: "Apple" },
  { id: "samsung", label: "Samsung" },
];

const checkboxClass =
  "h-4 w-4 shrink-0 rounded border-gray-300 text-sky-500 focus:ring-2 focus:ring-sky-400/40";

interface CheckboxGroupProps {
  title: string;
  items: { id: string; label: string; icon?: React.ReactNode }[];
  selected: string[];
  onToggle: (id: string) => void;
}

const CheckboxGroup = ({
  title,
  items,
  selected,
  onToggle,
}: CheckboxGroupProps) => {
  const groupId = useId();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const inputId = `${groupId}-${item.id}`;
          const isChecked = selected.includes(item.id);
          return (
            <label
              key={item.id}
              htmlFor={inputId}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                isChecked
                  ? "bg-sky-50 text-sky-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-sky-600"
              }`}>
              <input
                id={inputId}
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(item.id)}
                className={checkboxClass}
              />
              {item.icon && (
                <span className={isChecked ? "text-sky-500" : "text-gray-400"}>
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const SideFilter = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const priceRangeInvalid =
    minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice);

  const activeCount =
    selectedCategories.length +
    selectedBrands.length +
    (minPrice !== "" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0);

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    id: string,
  ) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  const handlePriceChange =
    (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || Number(value) >= 0) setter(value);
    };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-red-500">
            <IconX size={14} />
            Clear
          </button>
        )}
      </div>

      <div className="border-t border-gray-100 pt-5">
        <CheckboxGroup
          title="Category"
          items={categories}
          selected={selectedCategories}
          onToggle={(id) =>
            toggle(selectedCategories, setSelectedCategories, id)
          }
        />
      </div>

      <div className="border-t border-gray-100 pt-5">
        <CheckboxGroup
          title="Brand"
          items={brands}
          selected={selectedBrands}
          onToggle={(id) => toggle(selectedBrands, setSelectedBrands, id)}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
        <h3 className="text-base font-semibold text-gray-900">Price</h3>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <label
              htmlFor="price-from"
              className="text-xs font-medium text-gray-500">
              From
            </label>
            <input
              id="price-from"
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={handlePriceChange(setMinPrice)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 text-center text-sm text-gray-900 focus:border-sky-400 
              focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            />
          </div>

          <span className="mt-4 h-px w-3 shrink-0 bg-gray-300" />

          <div className="flex flex-1 flex-col gap-1">
            <label
              htmlFor="price-to"
              className="text-xs font-medium text-gray-500">
              To
            </label>
            <input
              id="price-to"
              type="number"
              min="0"
              placeholder="1000"
              value={maxPrice}
              onChange={handlePriceChange(setMaxPrice)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 text-center text-sm text-gray-900 focus:border-sky-400 
              focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            />
          </div>
        </div>

        {priceRangeInvalid && (
          <span className="text-xs text-red-600">
            "From" can't be greater than "To".
          </span>
        )}
      </div>
    </div>
  );
};

export default SideFilter;
