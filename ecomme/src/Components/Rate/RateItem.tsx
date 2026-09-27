/** @format */
import { useState } from "react";
import { Trash2 } from "lucide-react";
import RatingBadge from "./RatingBadge";
import { ConfirmDialog } from "../Utility/AppAlerts";

interface RateItemProps {
  name: string;
  score: number;
  description: string;
  canDelete?: boolean;
  onDelete?: () => void;
}

const RateItem = ({
  name,
  score,
  description,
  canDelete = false,
  onDelete,
}: RateItemProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleConfirm = () => {
    setConfirmOpen(false);
    onDelete?.();
  };

  return (
    <div className="flex gap-3 py-4">
      <div
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full 
        bg-sky-50 text-xs font-bold text-sky-600">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-900">{name}</span>
            <RatingBadge score={score} />
          </div>

          {canDelete && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              aria-label={`Delete review by ${name}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 
              transition-colors hover:bg-red-50 hover:text-red-500">
              <Trash2 size={15} />
            </button>
          )}
        </div>
        <p className="mt-1 break-words text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete review"
        message="This review will be permanently deleted. This can't be undone."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default RateItem;
