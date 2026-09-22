/** @format */
import { useState } from "react";
import { IconShoppingCart, IconStar } from "@tabler/icons-react";

// بيانات تجريبية: استبدلها ببيانات المنتج القادمة من الـ API
const product = {
  category: "Electronics",
  title: "Smart phone",
  rating: 4.5,
  brand: "Samsung",
  colors: ["#E52C2C", "#FFFFFF", "#000000"],
  description:
    "It features dual SIM support with one physical SIM and one eSIM. You can easily unlock your iPhone and sign in to apps, accounts, and more. Face ID is the fastest and most secure authentication method using facial recognition. It features the A12 Bionic chip, one of the smartest and most powerful smartphone chips. Its innovative sensor, ISP, and Neural Engine usher in a new era of photography, enabling you to capture unprecedented images. The single-lens camera keeps subjects in the foreground sharply in focus while creating a soft background blur.",
  price: 3400,
};

interface ProductsTextProps {
  onAddToCart?: () => void;
}

const ProductsText = ({ onAddToCart }: ProductsTextProps) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-gray-500">
        {" "}
        {product.category}
      </span>

      <h1 className="text-xl font-bold leading-snug text-gray-900">
        {" "}
        {product.title}
      </h1>

      <div className="flex items-center gap-1">
        <IconStar size={16} className="fill-amber-400 text-amber-400" />
        <span className="text-sm font-semibold text-gray-700">
          {product.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Brand:</span>
        <span className="font-semibold text-gray-900">{product.brand}</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Color</span>
        <div className="flex items-center gap-2">
          {product.colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              aria-label={`Select color ${color}`}
              aria-pressed={selectedColor === color}
              className={`h-8 w-8 rounded-full border-2 transition-shadow ${
                selectedColor === color
                  ? "border-sky-500 ring-2 ring-sky-200"
                  : "border-gray-200"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h2 className="mb-2 font-bold text-gray-900">Specifications</h2>
        <p className="break-words text-left leading-relaxed text-gray-600">
          {product.description}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
        <span className="rounded-lg border border-gray-200 px-4 py-2.5 text-lg font-bold text-gray-900">
          ${product.price.toLocaleString("en-US")}
        </span>
        <button
          type="button"
          onClick={onAddToCart}
          className="flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600">
          <IconShoppingCart size={17} />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductsText;
