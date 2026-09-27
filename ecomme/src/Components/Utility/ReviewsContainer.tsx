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

interface RawReview {
  _id: string;
  rating: number;
  comment: string;
  user: { _id: string; username: string } | null;
}

const ReviewsContainer = ({
  title,
  btntitle,
  pathText,
}: ReviewsContainerProps) => {
  const [reviews, setReviews] = useState<RawReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/review/featured")
      .then((res) => setReviews(res.data.reviews))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  // لا يوجد نظام تحقق من الشراء الفعلي بعد، فلا نعرض شارة "Verified Buyer" كاذبة
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
            rating={item.rating}
            review={item.comment}
            verified={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsContainer;
