/** @format */

import { Link } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

interface ProductCardProps {
  id: string | number;
  image: string;
  title?: string;
  ratingValue: number;
  ratingCount?: number;
  price: number;
  oldPrice?: number;
  onAddToCart?: (id: string | number) => void;
}

export default function ProductCard({
  id,
  image,
  title,
  ratingValue,
  ratingCount,
  price,
  oldPrice,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="flex p-2">
      <div className="my-2 w-full overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.12)]">
        {/* منطقة الصورة*/}
        <div className="relative bg-gray-50">
          <Link to={`/products/${id}`}>
            <img
              src={image}
              alt={title || "product"}
              className="w-full aspect-square object-contain p-2 rounded-2xl "
            />
          </Link>
          {/* زر المفضلة */}
          <button
            type="button"
            aria-label="favorite toggle"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md duration-500 
            hover:-translate-y-0.5 hover:text-red-500">
            <FavoriteBorderIcon className="!h-5 !w-5" />
          </button>
        </div>

        {/* المحتوى */}
        <div className="p-4">
          <Link to={`/products/${id}`} className="no-underline text-gray-900">
            <div className="text-base font-medium">{title || "product"}</div>
          </Link>

          <div className="mt-2 flex items-center gap-1 text-sm">
            <StarIcon className="!h-4 !w-4 text-yellow-500" />
            <span className="font-bold">{ratingValue}</span>
            {ratingCount !== undefined && (
              <span className="text-gray-400">({ratingCount})</span>
            )}
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {oldPrice !== undefined && (
              <span className="text-sm text-gray-400 line-through">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(id)}
            className="mt-4 flex w-full items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white 
            font-medium px-5 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap px-2 text-sm md:text-base">
            <ShoppingCartOutlinedIcon className="!h-5 !w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
