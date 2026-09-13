/** @format */

import { useState } from "react";

const categories = [
  { id: "all", labelAr: "الكل", labelEn: "All" },
  {
    id: "home_appliances",
    labelAr: "اجهزة منزلية",
    labelEn: "Home Appliances",
  },
  { id: "electronics", labelAr: "الكترونيات", labelEn: "Electronics" },
  { id: "clothes", labelAr: "ملابس", labelEn: "Clothes" },
  { id: "sales", labelAr: "تخفيضات", labelEn: "Discounts" },
];

const brands = [
  { id: "all", labelAr: "الكل", labelEn: "All" },
  { id: "apple", labelAr: "ابل", labelEn: "Apple" },
  { id: "samsung", labelAr: "سامسونج", labelEn: "Samsung" },
];

const SideFilter = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    id: string,
  ) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  return (
    <div className="mt-3 pl-4 text-left">
      <div>
        <div className="flex flex-col mt-2">
          <div className="filter-title text-left text-xl font-semibold">
            Category
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() =>
                    toggle(selectedCategories, setSelectedCategories, cat.id)
                  }
                />
                <div className="filter-sub ms-2">{cat.labelEn}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <div className="filter-title text-left text-xl font-semibold">
            Brand
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() =>
                    toggle(selectedBrands, setSelectedBrands, brand.id)
                  }
                />
                <div className="filter-sub ms-2">{brand.labelEn}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-title text-left text-xl font-semibold mt-6 mb-3">
          Price
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <p className="filter-sub w-10">From:</p>
            <input
              className="text-center w-[50px] h-[25px] border rounded-sm"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="filter-sub w-10">To:</p>
            <input
              className="text-center w-[50px] h-[25px] border rounded-sm"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideFilter;
