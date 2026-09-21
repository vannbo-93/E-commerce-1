/** @format */

import smartphone from "../../images/allProducts/smartphone.png";
import StarIcon from "@mui/icons-material/Star";

interface UserAllOrderCardProps { image?: string; title?: string; rate?: number; reviewsCount?: number; quantity?: number;}

const UserAllOrderCard = ({ image = smartphone, title = "smart phone", rate = 4.7, reviewsCount = 160, quantity = 1,}: UserAllOrderCardProps) => {
  return (
    <div className="mb-2 flex gap-3">
      <div className="flex h-[120px] w-[93px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
        <img src={image} alt={title}
          className="max-h-[90%] max-w-[90%] object-contain flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50"/>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="mt-1 text-sm font-semibold leading-snug text-gray-900">{title}</h3>

        <div className="mt-1 flex items-center gap-1">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <span className="text-xs font-semibold text-gray-600"> {rate.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({reviewsCount} reviews)</span>
        </div>

        <p className="mt-3 text-sm">
          <span className="text-gray-500">Quantity:</span>{" "}
          <span className="font-medium text-gray-900">{quantity}</span>
        </p>
      </div>
    </div>
  );
};

export default UserAllOrderCard;
