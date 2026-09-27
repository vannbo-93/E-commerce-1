/** @format */
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IconHeart,
  IconPhoto,
  IconShoppingCart,
  IconStar,
} from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

// عدّله إن كان مسار صفحة الدخول مختلفًا في الـ Router
const LOGIN_PATH = "/login";

export type CardCartStatus = "idle" | "adding" | "added" | "error";

interface ProductCardProps {
  id: string;
  title: string;
  image: string | null;
  ratingValue: number;
  ratingCount?: number;
  price: number;
  oldPrice?: number;
  // منتج له ألوان لا يُضاف من البطاقة: الزر يفتح صفحته لاختيار اللون
  hasOptions?: boolean;
  onAddToCart?: (id: string) => void;
  cartStatus?: CardCartStatus;
  cartError?: string;
}

const ProductCard = ({
  id,
  title,
  image,
  ratingValue,
  ratingCount = 0,
  price,
  oldPrice,
  hasOptions = false,
  onAddToCart,
  cartStatus = "idle",
  cartError,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  // القلب يعمل من داخل البطاقة، فلا يحتاج أي قسم لتمرير المفضلة
  const { isInWishlist, toggle } = useWishlist();
  const isFavorite = isInWishlist(id);
  const productPath = `/products/${id}`;

  const handleToggleFavorite = () => {
    if (authLoading) return;
    if (!user) {
      navigate(LOGIN_PATH, { state: { from: location.pathname } });
      return;
    }
    toggle(id).catch((err) => console.error("toggle failed", err));
  };

  const buttonClass =
    "mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-3 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500";

  const buttonLabel =
    cartStatus === "adding"
      ? "Adding..."
      : cartStatus === "added"
        ? "Added"
        : "Add to Cart";

  return (
    <div
      className="flex h-full flex-col rounded-2xl bg-white p-2 shadow-[0_2px_16px_rgba(0,0,0,0.08)]
    transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]">
      <div className="relative">
        <Link to={productPath} className="block no-underline">
          <div className="flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
            {image ? (
              <img
                src={image}
                alt={title}
                className="max-h-[90%] max-w-[100%] rounded-2xl object-contain"
              />
            ) : (
              <IconPhoto
                size={32}
                className="text-gray-300"
                aria-hidden="true"
              />
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleToggleFavorite}
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
        <Link to={productPath} className="no-underline">
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-gray-900">
            {title}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-1">
          {ratingCount > 0 ? (
            <>
              <IconStar size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-gray-700">
                {ratingValue.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">({ratingCount})</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">No reviews yet</span>
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

        {hasOptions ? (
          <Link to={productPath} className={buttonClass}>
            <IconShoppingCart size={16} className="shrink-0" />
            <span className="truncate">Choose options</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onAddToCart?.(id)}
            disabled={!onAddToCart || cartStatus === "adding"}
            className={buttonClass}>
            <IconShoppingCart size={16} className="shrink-0" />
            <span className="truncate">{buttonLabel}</span>
          </button>
        )}

        {cartStatus === "error" && cartError && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {cartError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
