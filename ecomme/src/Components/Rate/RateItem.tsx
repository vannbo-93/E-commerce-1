/** @format */

import RatingBadge from "./RatingBadge";

interface RateItemProps {
  name?: string;
  score?: number;
  description?: string;
}

const RateItem = ({
  name = "Mohamed El Aissaoui",
  score = 4.3,
  description = "A suitable product, its price is currently very good, and it has an extra shield",
}: RateItemProps) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex gap-3 py-4">
      <div
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-900">{name}</span>
          <RatingBadge score={score} />
        </div>
        <p className="mt-1 break-words text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
};

export default RateItem;
