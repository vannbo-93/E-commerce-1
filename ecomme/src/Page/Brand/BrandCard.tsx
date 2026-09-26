/** @format */
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "../../Components/Utility/AppAlerts";

interface BrandCardProps {
  id: string;
  name: string;
  img: string;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const BrandCard = ({
  id,
  name,
  img,
  isAdmin = false,
  onDelete,
}: BrandCardProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    onDelete?.(id);
  };

  return (
    <div className="group relative flex cursor-pointer flex-col items-center gap-2">
      {isAdmin && onDelete && (
        <button
          type="button"
          onClick={handleDeleteClick}
          aria-label={`Delete ${name}`}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white 
          text-gray-500 opacity-0 shadow-sm transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
          <Trash2 size={16} />
        </button>
      )}

      {/* الإطار يحوي الصورة فقط، بارتفاع ثابت لكل البطاقات مهما اختلفت نسبة الشعار */}
      <div
        className="flex h-28 w-full items-center justify-center rounded-xl border border-gray-200 bg-sky-50 p-4 
      transition-all duration-200 hover:-translate-y-1 hover:bg-sky-100 hover:shadow-lg">
        <img
          src={img}
          alt={name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* الاسم خارج الإطار، أسفله مباشرة */}
      <span className="text-sm font-semibold text-gray-900">{name}</span>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete brand"
        message={`"${name}" will be permanently deleted, including its image. This can't be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default BrandCard;
