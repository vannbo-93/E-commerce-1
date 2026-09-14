/** @format */
import React from "react";
import mobile from "../../images/mobile.png";
import { Trash2 } from "lucide-react";

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

const CartItem: React.FC<CartItemProps> = ({
  image = mobile,
  category,
  title,
  rate,
  brand,
  color,
  quantity,
  price,
  onQuantityChange,
  onDelete,}) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!Number.isNaN(value) && value >= 0) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-700 last:border-b-0">
      <img
        className="w-20 h-20 md:w-29 md:h-55 object-cover rounded-lg border border-gray-700 shrink-0"
        src={image} alt={title}/>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <span className="text-xs text-gray-400">{category}</span>
          <button
            type="button" onClick={onDelete}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="text-red-500 w-6 h-6" width={16} height={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <h3 className="text-sm md:text-base font-medium leading-snug line-clamp-2">{title}</h3>
          <span className="shrink-0 text-xs font-semibold text-amber-500"> ★ {rate}</span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-sm">
          <span className="text-gray-400 font-bold">Brand:</span>
          <span className="font-medium">{brand}</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span
            className="w-5 h-5 rounded-full border border-gray-600" style={{ backgroundColor: color }}/>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-bold">Quantity</span>
            <input type="number" min={0} value={quantity}
              onChange={handleQuantityChange}
              className="w-14 h-8 text-center border border-gray-600 rounded-md bg-transparent 
              focus:outline-none focus:border-blue-500" />
          </div>
          <span className="text-sm md:text-base font-semibold "> {price} MAD </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
