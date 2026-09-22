/** @format */

import ReactStarsRaw from "react-rating-stars-component";
import { IconStar, IconStarHalfFilled } from "@tabler/icons-react";

const ReactStars =
  (ReactStarsRaw as unknown as { default: typeof ReactStarsRaw }).default ??
  ReactStarsRaw;

interface RatePostProps {
  rating?: number;
  editable?: boolean;
  onRatingChange?: (newRating: number) => void;
}

const RatePost = ({
  rating = 0,
  editable = false,
  onRatingChange,
}: RatePostProps) => {
  const ratingChanged = (newRating: number) => {
    onRatingChange?.(newRating);
  };

  return (
    <ReactStars
      count={5}
      value={rating}
      edit={editable}
      onChange={ratingChanged}
      size={24}
      isHalf={true}
      emptyIcon={<IconStar size={24} className="text-gray-300" />}
      halfIcon={
        <IconStarHalfFilled
          size={24}
          className="fill-amber-400 text-amber-400"
        />
      }
      filledIcon={
        <IconStar size={24} className="fill-amber-400 text-amber-400" />
      }
      activeColor="#fbbf24"
    />
  );
};

export default RatePost;
