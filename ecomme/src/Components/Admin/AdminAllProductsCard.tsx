/** @format */
import React from "react";
import { Link } from "react-router-dom";
import { Star, Trash2, Pencil } from "lucide-react";

interface AdminAllProductsCardProps {
  id: string | number;
  image: string;
  title: string;
  rate: number;
  price: number;
  onDelete: () => void;
  onEdit: () => void;
}

const AdminAllProductsCard: React.FC<AdminAllProductsCardProps> = ({
  id,
  image,
  title,
  rate,
  price,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="group rounded-2xl bg-[#1E1F2B] text-white overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-white/5">
      <div className="flex justify-end gap-2 px-3 pt-3">
        <button
          type="button"
          onClick={onDelete}
          aria-label="Remove product"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
          <Trash2 size={15} />
        </button>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit product"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors">
          <Pencil size={15} />
        </button>
      </div>

      <Link to={`/products/${id}`} className="no-underline block">
        <div className="px-3 pt-2">
          <div className="w-full h-[200px] rounded-xl bg-[#2A2C3B] flex items-center justify-center overflow-hidden">
            <img
              src={image}
              alt={title}
              className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-100 line-clamp-2 min-h-[2.5rem]">
            {" "}
            {title}
          </h3>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-gray-300">
                {rate}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-white">{price}</span>
              <span className="text-xs text-gray-400">MAD</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AdminAllProductsCard;
