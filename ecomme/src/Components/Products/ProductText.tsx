/** @format */
import { useState } from "react";
import { IconShoppingCart, IconStar } from "@tabler/icons-react";

export interface CartFeedback {
  kind: "success" | "error";
  text: string;
}

interface ProductsTextProps {
  category: string;
  title: string;
  rating: number;
  ratingCount?: number;
  brand: string;
  colors: string[];
  description: string;
  price: number;
  priceBeforeDiscount?: number;
  // يستقبل اللون المختار، فالمكوّن لا يعرف شيئًا عن الـ API أو السلة
  onAddToCart?: (color: string | null) => void;
  isAdding?: boolean;
  cartFeedback?: CartFeedback | null;
}

const ProductsText = ({
  category,
  title,
  rating,
  ratingCount = 0,
  brand,
  colors,
  description,
  price,
  priceBeforeDiscount,
  onAddToCart,
  isAdding = false,
  cartFeedback = null,
}: ProductsTextProps) => {
  // null صراحةً لمنتج بلا ألوان، بدل undefined مخفي خلف نوع string
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors[0] ?? null,
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-gray-500">{category}</span>
      <h1 className="text-xl font-bold leading-snug text-gray-900">{title}</h1>

      {ratingCount > 0 ? (
        <div className="flex items-center gap-1">
          <IconStar size={16} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-gray-700">
            {rating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-400">({ratingCount})</span>
        </div>
      ) : (
        <span className="text-sm text-gray-400">No reviews yet</span>
      )}

      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Brand:</span>
        <span className="font-semibold text-gray-900">{brand}</span>
      </div>

      {colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-500">Color</span>
          <div className="flex items-center gap-2">
            {colors.map((color) => (
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
      )}

      <div className="border-t border-gray-100 pt-4">
        <h2 className="mb-2 font-bold text-gray-900">Specifications</h2>
        <p className="break-words text-left leading-relaxed text-gray-600">
          {description}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
        <span className="rounded-lg border border-gray-200 px-4 py-2.5 text-lg font-bold text-gray-900">
          ${price.toLocaleString("en-US")}
        </span>
        {typeof priceBeforeDiscount === "number" &&
          priceBeforeDiscount > price && (
            <span className="text-sm text-gray-400 line-through">
              ${priceBeforeDiscount.toLocaleString("en-US")}
            </span>
          )}
        <button
          type="button"
          onClick={() => onAddToCart?.(selectedColor)}
          disabled={isAdding || !onAddToCart}
          className="flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors
          hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500">
          <IconShoppingCart size={17} />
          {isAdding ? "Adding..." : "Add to cart"}
        </button>
      </div>

      {cartFeedback && (
        <p
          role={cartFeedback.kind === "error" ? "alert" : "status"}
          className={`text-sm ${
            cartFeedback.kind === "error" ? "text-red-600" : "text-green-600"
          }`}>
          {cartFeedback.text}
        </p>
      )}
    </div>
  );
};

export default ProductsText;
