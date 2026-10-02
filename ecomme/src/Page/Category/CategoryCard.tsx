/** @format */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "../../Components/Utility/AppAlerts";

interface CategoryCardProps {
  id: string;
  title: string;
  img: string;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const CategoryCard = ({
  id,
  title,
  img,
  isAdmin = false,
  onDelete,
}: CategoryCardProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setConfirmOpen(false);
    onDelete?.(id);
  };

  return (
    <div className="group relative">
      {/* البطاقة رابط للمتجر مفلترًا بهذا التصنيف */}
      <Link
        to={`/products?category=${id}`}
        className="flex flex-col items-center rounded-xl p-3 text-gray-900 no-underline transition-all duration-300 hover:-translate-y-1">
        <img
          src={img}
          alt=""
          className="h-28 w-28 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
        />
        <h3 className="mt-3 text-sm font-semibold transition-colors duration-300 group-hover:text-sky-500">
          {title}
        </h3>
      </Link>

      {/* زر الحذف خارج الرابط لا داخله: زر داخل رابط غير صالح في HTML،
          والضغط عليه كان سيفتح صفحة التصنيف بدل نافذة التأكيد */}
      {isAdmin && onDelete && (
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          aria-label={`Delete ${title}`}
          className="absolute right-1 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white
          text-gray-500 opacity-0 shadow-sm transition-opacity hover:bg-red-50 hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100">
          <Trash2 size={16} />
        </button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete category"
        message={`"${title}" and all its subcategories will be permanently deleted, including images. This can't be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default CategoryCard;
