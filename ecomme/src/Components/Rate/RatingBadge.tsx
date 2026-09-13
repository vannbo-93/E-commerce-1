/** @format */

interface RatingBadgeProps {
  score: number;
}

const RatingBadge = ({ score }: RatingBadgeProps) => {
  return (
    <span className="inline-flex items-center gap-1 text-yellow-500 font-bold">
      <i className="fa fa-star text-sm"></i>
      <span>{score}</span>
    </span>
  );
};

export default RatingBadge;
