/** @format */
import { NavLink } from "react-router-dom";

// فئات مناسبة لمتجر إلكترونيات فقط
const categories = [
  { label: "All", to: "/shop" },
  { label: "Phones & Tablets", to: "/shop?category=phones" },
  { label: "Laptops & Computers", to: "/shop?category=laptops" },
  { label: "Audio", to: "/shop?category=audio" },
  { label: "Smart Wearables", to: "/shop?category=wearables" },
  { label: "Accessories", to: "/shop?category=accessories" },
  { label: "Discounts", to: "/shop?category=discounts" },
];

const CategoryHeader = () => {
  return (
    <nav
      aria-label="Product categories"
      className="flex flex-nowrap gap-3 overflow-x-auto whitespace-nowrap border-b border-gray-100 px-2 py-3">
      {categories.map((cat) => (
        <NavLink
          key={cat.to}
          to={cat.to}
          className={({ isActive }) =>
            `shrink-0 rounded-full px-3 py-1.5 text-sm font-medium no-underline transition-colors ${
              isActive
                ? "bg-sky-500 text-white"
                : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
            }`
          }>
          {cat.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default CategoryHeader;
