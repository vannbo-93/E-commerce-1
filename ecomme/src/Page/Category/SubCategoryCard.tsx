/** @format */
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "../../Components/Utility/AppAlerts";

interface SubCategoryCardProps {
  id: string;
  name: string;
  categoryName: string;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const SubCategoryCard = ({
  id,
  name,
  categoryName,
  isAdmin = false,
  onDelete,
}: SubCategoryCardProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setConfirmOpen(false);
    onDelete?.(id);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
        <p className="mt-0.5 truncate text-xs text-gray-500">
          Under: {categoryName}
        </p>
      </div>

      {isAdmin && onDelete && (
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          aria-label={`Delete ${name}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors 
          hover:bg-red-50 hover:text-red-500">
          <Trash2 size={16} />
        </button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete subcategory"
        message={`"${name}" will be permanently deleted. This can't be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default SubCategoryCard;
