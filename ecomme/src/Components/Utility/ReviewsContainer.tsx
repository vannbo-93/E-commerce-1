/** @format */
import { useEffect, useState } from "react";
import ReviewCard from "./CustomerReviews";
import SubTitle from "./SubTitle";
import api from "../../Api/baseURL";

interface ReviewsContainerProps {
  title?: string;
  btntitle?: string;
  pathText?: string;
}

// نفس شكل رد الباك إند (reviewService.ts → ReviewResponse)
interface RawReview {
  _id: string;
  rating: number;
  comment: string;
  user: { _id: string; username: string; avatar?: string } | null;
  verified?: boolean;
}

const ReviewsContainer = ({
  title,
  btntitle,
  pathText,
}: ReviewsContainerProps) => {
  const [reviews, setReviews] = useState<RawReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/review/featured")
      .then((res) => {
        if (!cancelled) setReviews(res.data.reviews ?? []);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <div className="my-4 w-full">
      {title ? (
        <SubTitle title={title} btnTitle={btntitle} pathText={pathText} />
      ) : null}

      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
        {reviews.map((item) => (
          <ReviewCard
            key={item._id}
            name={item.user?.username ?? "Anonymous"}
            {...(item.user?.avatar ? { avatar: item.user.avatar } : {})}
            rating={item.rating}
            review={item.comment}
            // من الباك إند: كاتب التقييم استلم طلبًا فيه هذا المنتج
            verified={item.verified === true}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsContainer;
