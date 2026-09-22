/** @format */
import { IconStar } from "@tabler/icons-react";

interface RatingBadgeProps {
  score: number;
}

const RatingBadge = ({ score }: RatingBadgeProps) => {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-500">
      <IconStar size={14} className="fill-amber-400 text-amber-400" />
      <span>{score.toFixed(1)}</span>
    </span>
  );
};

export default RatingBadge;
