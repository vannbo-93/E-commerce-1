/** @format */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "../../Components/Utility/AppAlerts";
import { optimizeImage } from "@/utils/cloudinary";

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

  const handleConfirm = () => {
    setConfirmOpen(false);
    onDelete?.(id);
  };

  return (
    <div className="group relative">
      {/* البطاقة رابط للمتجر مفلترًا بهذه الماركة */}
      <Link
        to={`/products?brand=${id}`}
        className="flex flex-col items-center gap-2 no-underline">
        {/* الإطار يحوي الصورة فقط، بارتفاع ثابت لكل البطاقات مهما اختلفت نسبة الشعار */}
        <div
          className="flex h-28 w-full items-center justify-center rounded-xl border border-gray-200 bg-sky-50 p-4 
          transition-all duration-200 group-hover:-translate-y-1 group-hover:bg-sky-100 group-hover:shadow-lg">
          <img
            src={optimizeImage(img, 400)}
            alt={name}
            loading="lazy"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* الاسم خارج الإطار، أسفله مباشرة */}
        <span className="text-sm font-semibold text-gray-900">{name}</span>
      </Link>

      {/* زر الحذف خارج الرابط: زر داخل رابط غير صالح في HTML */}
      {isAdmin && onDelete && (
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          aria-label={`Delete ${name}`}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white 
          text-gray-500 shadow-sm transition-opacity hover:bg-red-50 hover:text-red-500
          opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100">
          <Trash2 size={16} />
        </button>
      )}

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
