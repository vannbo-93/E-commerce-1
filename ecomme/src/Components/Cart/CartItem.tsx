/** @format */
import React from "react";
import smartphone from "../../../src/images/allProducts/smartphone.png";
import { Minus, Plus, Star, Trash2 } from "lucide-react";

interface CartItemProps {
  image?: string;
  category: string;
  title: string;
  rate: number;
  brand: string;
  color: string;
  quantity: number;
  price: number;
  onQuantityChange: (newQuantity: number) => void;
  onDelete: () => void;
}

const MIN_QTY = 1;
const MAX_QTY = 99;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

const stepperBtn =
  "flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:text-sky-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-600";

const CartItem: React.FC<CartItemProps> = ({
  image = smartphone,
  category,
  title,
  rate,
  brand,
  color,
  quantity,
  price,
  onQuantityChange,
  onDelete,
}) => {
  return (
    <div className="flex gap-4 py-5">
      {/* الصورة */}
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 md:h-32 md:w-32">
        <img
          className="h-full w-full object-contain p-2"
          src={image}
          alt={title}
        />
      </div>

      <div className="min-w-0 flex-1">
        {/* التصنيف وزر الحذف */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs capitalize text-gray-500">{category}</span>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Remove ${title}`}
            className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-full text-red-500 
            transition-colors hover:bg-red-50">
            <Trash2 size={18} />
          </button>
        </div>

        {/* العنوان والتقييم */}
        <div className="mt-0.5 flex flex-col gap-1">
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 md:text-base">
            {title}
          </h3>

          <span className="shrink-0 text-xs font-semibold text-gray-700">
            <Star
              size={14}
              className="mr-1 inline fill-yellow-400 text-yellow-400 align-[-2px]"
            />
            {rate}
          </span>
        </div>

        {/* الماركة واللون */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Brand:</span>
            <span className="font-medium text-gray-900">{brand}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Color:</span>
            <span
              className="h-4 w-4 rounded-full border border-gray-200 shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          </div>
        </div>

        {/* الكمية والسعر */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-lg border border-gray-200">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= MIN_QTY}
              onClick={() => onQuantityChange(quantity - 1)}
              className={stepperBtn}>
              <Minus size={14} />
            </button>
            <span
              className="w-8 text-center text-sm font-medium text-gray-900"
              aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= MAX_QTY}
              onClick={() => onQuantityChange(quantity + 1)}
              className={stepperBtn}>
              <Plus size={14} />
            </button>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-gray-900 md:text-base">
              {formatPrice(price * quantity)}
            </div>
            {quantity > 1 ? (
              <div className="text-xs text-gray-500">
                {formatPrice(price)} each
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
