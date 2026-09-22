/** @format */
import { useState } from "react";
import { Link } from "react-router-dom";
import { IconHeart, IconShoppingCart, IconStar } from "@tabler/icons-react";

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  ratingValue: number;
  ratingCount?: number;
  price: number;
  oldPrice?: number;
  onAddToCart?: (id: string) => void;
}

const ProductCard = ({
  id,
  title,
  image,
  ratingValue,
  ratingCount,
  price,
  oldPrice,
  onAddToCart,
}: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-2 shadow-[0_2px_16px_rgba(0,0,0,0.08)] 
    transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]">
      <div className="relative">
        <Link to={`/products/${id}`} className="block no-underline">
          <div className="flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
            <img
              src={image}
              alt={title}
              className="max-h-[90%] max-w-[100%] object-contain rounded-2xl"
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsFavorite((f) => !f)}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isFavorite}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full 
          bg-white/90 text-gray-500 shadow-sm transition-colors hover:text-red-500">
          <IconHeart
            size={17}
            className={isFavorite ? "fill-red-500 text-red-500" : ""}
          />
        </button>
      </div>

      {/* flex-1 يدفع السعر والزر إلى أسفل البطاقة دائمًا، حتى لو التف العنوان على سطرين */}
      <div className="flex flex-1 flex-col px-1 pt-3">
        <Link to={`/products/${id}`} className="no-underline">
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-gray-900">
            {title}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-1">
          <IconStar size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-gray-700">
            {ratingValue.toFixed(1)}
          </span>
          {typeof ratingCount === "number" && (
            <span className="text-xs text-gray-400">({ratingCount})</span>
          )}
        </div>

        <div className="mt-2 flex flex-1 items-end justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {typeof oldPrice === "number" && oldPrice > price && (
              <span className="text-xs text-gray-400 line-through">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart?.(id)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-3 py-2.5 text-sm 
          font-semibold text-white transition-colors hover:bg-sky-600">
          <IconShoppingCart size={16} className="shrink-0" />
          <span className="truncate">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
