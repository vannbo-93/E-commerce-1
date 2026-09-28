/** @format */
import { useEffect, useId, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
import api from "../../Api/baseURL";

// أسماء معاملات الرابط: نفس ما يقبله GET /product في الباك إند
const PARAM = {
  category: "category",
  brand: "brand",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  onSale: "onSale",
  page: "page",
} as const;

interface FilterOption {
  _id: string;
  name: string;
}

const checkboxClass =
  "h-4 w-4 shrink-0 rounded border-gray-300 text-sky-500 focus:ring-2 focus:ring-sky-400/40";

const priceInputClass =
  "h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 text-center text-sm text-gray-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40";

// "id1,id2" ↔ ["id1", "id2"]
const readList = (value: string | null): string[] =>
  value ? value.split(",").filter(Boolean) : [];

interface CheckboxGroupProps {
  title: string;
  items: FilterOption[];
  selected: string[];
  onToggle: (id: string) => void;
  loading: boolean;
}

const CheckboxGroup = ({
  title,
  items,
  selected,
  onToggle,
  loading,
}: CheckboxGroupProps) => {
  const groupId = useId();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {loading ? (
        <p className="px-2 text-xs text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="px-2 text-xs text-gray-400">Nothing to filter yet.</p>
      ) : (
        <div className="flex max-h-60 flex-col gap-1 overflow-y-auto">
          {items.map((item) => {
            const inputId = `${groupId}-${item._id}`;
            const isChecked = selected.includes(item._id);
            return (
              <label
                key={item._id}
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
                  onChange={() => onToggle(item._id)}
                  className={checkboxClass}
                />
                <span className="flex-1 capitalize">{item.name}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface PriceRangeProps {
  initialMin: string;
  initialMax: string;
  onApply: (min: string, max: string) => void;
}

// يُعاد إنشاؤه (key) كلما تغيّر السعر في الرابط، فيبقى متزامنًا مع زر الرجوع و"Clear"
// دون useEffect. التطبيق عند الخروج من الحقل أو Enter، لا مع كل حرف.
const PriceRange = ({ initialMin, initialMax, onApply }: PriceRangeProps) => {
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);

  const invalid =
    minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice);

  const apply = () => {
    if (invalid) return;
    if (minPrice === initialMin && maxPrice === initialMax) return;
    onApply(minPrice, maxPrice);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    apply();
  };

  const sanitize = (value: string) =>
    value === "" || Number(value) >= 0 ? value : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
            onChange={(e) => {
              const v = sanitize(e.target.value);
              if (v !== null) setMinPrice(v);
            }}
            onBlur={apply}
            className={priceInputClass}
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
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => {
              const v = sanitize(e.target.value);
              if (v !== null) setMaxPrice(v);
            }}
            onBlur={apply}
            className={priceInputClass}
          />
        </div>
      </div>

      {invalid ? (
        <span className="text-xs text-red-600">
          "From" can't be greater than "To".
        </span>
      ) : (
        <span className="text-xs text-gray-400">Press Enter to apply.</span>
      )}

      {/* زر مخفي: يجعل Enter داخل أي حقل يرسل النموذج */}
      <button
        type="submit"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
    </form>
  );
};

const SideFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [brands, setBrands] = useState<FilterOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // الفلاتر المختارة تُقرأ من الرابط، لا من state: الرابط هو مصدر الحقيقة الوحيد
  const selectedCategories = readList(searchParams.get(PARAM.category));
  const selectedBrands = readList(searchParams.get(PARAM.brand));
  const minPrice = searchParams.get(PARAM.minPrice) ?? "";
  const maxPrice = searchParams.get(PARAM.maxPrice) ?? "";
  const onSale = searchParams.get(PARAM.onSale) === "true";

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.get("/category"), api.get("/brand")])
      .then(([catRes, brandRes]) => {
        if (cancelled) return;
        setCategories(catRes.data.categories ?? []);
        setBrands(brandRes.data.brands ?? []);
      })
      .catch(() => {
        // فشل جلب الخيارات لا يمنع عرض المنتجات؛ تبقى القوائم فارغة
      })
      .finally(() => {
        if (!cancelled) setOptionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // كل تغيير في الفلاتر يعيد الترقيم للصفحة الأولى
  const updateParams = (changes: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(changes)) {
        if (value === "") next.delete(key);
        else next.set(key, value);
      }
      next.delete(PARAM.page);
      return next;
    });
  };

  const toggleInList = (param: string, current: string[], id: string) => {
    const next = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    updateParams({ [param]: next.join(",") });
  };

  const activeCount =
    selectedCategories.length +
    selectedBrands.length +
    (minPrice !== "" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0) +
    (onSale ? 1 : 0);

  const clearFilters = () =>
    updateParams({
      [PARAM.category]: "",
      [PARAM.brand]: "",
      [PARAM.minPrice]: "",
      [PARAM.maxPrice]: "",
      [PARAM.onSale]: "",
    });

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-xs 
            font-semibold text-white">
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

      {/* عروض: منتجات سعرها قبل الخصم أعلى من سعرها الحالي */}
      <label
        className={`flex cursor-pointer items-center gap-2.5 rounded-lg border-t border-gray-100 px-2 pt-5 text-sm font-medium ${
          onSale ? "text-sky-700" : "text-gray-700"
        }`}>
        <input
          type="checkbox"
          checked={onSale}
          onChange={() =>
            updateParams({ [PARAM.onSale]: onSale ? "" : "true" })
          }
          className={checkboxClass}
        />
        On sale only
      </label>

      <div className="border-t border-gray-100 pt-5">
        <CheckboxGroup
          title="Category"
          items={categories}
          selected={selectedCategories}
          onToggle={(id) =>
            toggleInList(PARAM.category, selectedCategories, id)
          }
          loading={optionsLoading}
        />
      </div>

      <div className="border-t border-gray-100 pt-5">
        <CheckboxGroup
          title="Brand"
          items={brands}
          selected={selectedBrands}
          onToggle={(id) => toggleInList(PARAM.brand, selectedBrands, id)}
          loading={optionsLoading}
        />
      </div>

      <div className="border-t border-gray-100 pt-5">
        <PriceRange
          key={`${minPrice}|${maxPrice}`}
          initialMin={minPrice}
          initialMax={maxPrice}
          onApply={(min, max) =>
            updateParams({ [PARAM.minPrice]: min, [PARAM.maxPrice]: max })
          }
        />
      </div>
    </div>
  );
};

export default SideFilter;
