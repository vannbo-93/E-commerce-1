/** @format */
import { useState } from "react";
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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // يمنع أي تنقل مستقبلي على البطاقة نفسها
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    onDelete?.(id);
  };

  return (
    <div className="group relative cursor-pointer">
      {isAdmin && onDelete && (
        <button
          type="button"
          onClick={handleDeleteClick}
          aria-label={`Delete ${title}`}
          className="absolute right-1 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white 
          text-gray-500 opacity-0 shadow-sm transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
          <Trash2 size={16} />
        </button>
      )}

      <div className="flex flex-col items-center rounded-xl p-3 transition-all duration-300 hover:-translate-y-1">
        <img
          src={img}
          alt={title}
          className="h-28 w-28 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
        />

        <h3 className="mt-3 text-sm font-semibold transition-colors duration-300 group-hover:text-sky-500">
          {title}
        </h3>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete category"
        message={`"${title}" will be permanently deleted, including its image. This can't be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default CategoryCard;
