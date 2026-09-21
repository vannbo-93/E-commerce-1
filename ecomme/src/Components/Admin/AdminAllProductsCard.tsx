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
    <div
      className="group flex h-full flex-col rounded-2xl bg-white p-2 shadow-[0_2px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300
     hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]">
      <Link to={`/products/${id}`} className="block flex-1 no-underline">
        <div className="flex h-52 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
          <img
            src={image}
            alt={title}
            className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105 rounded-2xl"
          />
        </div>

        <div className="px-2 pt-3">
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-gray-900">
            {title}
          </h3>

          <div className="mt-1 flex items-center gap-1">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-600">{rate}</span>
          </div>

          <p className="mt-2 text-lg font-bold text-gray-900">
            ${price.toFixed(2)}
          </p>
        </div>
      </Link>

      <div className="mt-3 flex gap-2 px-2 pb-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600 ">
          <Pencil size={15} />
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Remove product"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-500 transition-colors 
          hover:bg-red-500 hover:text-white ">
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminAllProductsCard;
