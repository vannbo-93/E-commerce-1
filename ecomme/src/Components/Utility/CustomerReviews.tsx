/** @format */
import StarIcon from "@mui/icons-material/Star";
import CheckIcon from "@mui/icons-material/Check";
import UserAvatar from "./UserAvatar";

interface ReviewCardProps {
  name: string;
  avatar?: string; // فارغ = الحروف الأولى بلون ثابت لكل مستخدم
  review: string;
  rating?: number; // من 0 إلى 5
  // false افتراضيًا: الشارة تظهر فقط حين يؤكدها الباك إند (طلب مُسلَّم فيه المنتج)
  verified?: boolean;
}

const ReviewCard = ({
  name,
  avatar,
  review,
  rating = 5,
  verified = false,
}: ReviewCardProps) => {
  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]">
      {/* الصورة والاسم */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <UserAvatar name={name} src={avatar} size={64} framed />

          {verified ? (
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-600 text-white shadow-sm"
              aria-hidden="true">
              <CheckIcon className="!h-3 !w-3" />
            </span>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-gray-900">
            {name}
          </div>
          {verified ? (
            <div className="text-sm font-medium text-green-700">
              Verified Buyer
            </div>
          ) : null}
        </div>
      </div>

      {/* النجوم */}
      <div
        className="mt-4 flex gap-1"
        role="img"
        aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon
            key={n}
            className={`!h-5 !w-5 ${n <= rating ? "text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>

      {/* النص */}
      <p className="mt-3 break-words text-sm leading-relaxed text-gray-700">
        {review}
      </p>
    </div>
  );
};

export default ReviewCard;
