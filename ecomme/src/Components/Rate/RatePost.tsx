/** @format */

import ReactStarsRaw from "react-rating-stars-component";

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
      emptyIcon={<i className="far fa-star"></i>}
      halfIcon={<i className="fa fa-star-half-alt"></i>}
      filledIcon={<i className="fa fa-star"></i>}
      activeColor="#ffd700"
    />
  );
};

export default RatePost;
