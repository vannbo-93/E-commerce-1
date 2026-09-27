/** @format */
import { useEffect, useState } from "react";
import RateItem from "./RateItem";
import RatePost from "./RatePost";
import RatingBadge from "./RatingBadge";
import PaginationComponent from "../Utility/Pagination";
import api from "../../Api/baseURL";
import { useAuth } from "../../context/AuthContext";
import { isAxiosError } from "axios";

interface RawReview {
  _id: string;
  rating: number;
  comment: string;
  user: { _id: string; username: string } | null;
}

interface RateContainerProps {
  productId: string;
}

const RateContainer = ({ productId }: RateContainerProps) => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<RawReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);

  const fetchReviews = () => {
    setLoading(true);
    api
      .get(`/review/product/${productId}`)
      .then((res) => setReviews(res.data.reviews))
      .catch(() => setError("Failed to load reviews."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line -- استدعاء ضروري عند تحميل المكوّن أو تغيّر productId، نفس النمط المطبَّق في ProductDetails.tsx
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchReviews تُعاد إنشاؤها كل رسم، إضافتها للمصفوفة تُسبّب حلقة لا نهائية
  }, [productId]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async () => {
    if (userRating === 0 || comment.trim() === "" || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      await api.post(`/review/product/${productId}`, {
        rating: userRating,
        comment: comment.trim(),
      });
      setComment("");
      setUserRating(0);
      setWidgetKey((prev) => prev + 1);
      fetchReviews(); // يُحدَّث المتوسط والقائمة معًا فور النجاح
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? "Something went wrong")
        : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const previous = reviews;
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));

    try {
      await api.delete(`/review/${reviewId}`);
    } catch {
      setReviews(previous);
      setError("Failed to delete the review. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-900">Reviews</span>
        <RatingBadge score={averageRating} />
        <span className="text-sm text-gray-400">
          ({reviews.length} reviews)
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {user ? (
        <>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{user.username}</span>
            <RatePost
              key={widgetKey}
              rating={userRating}
              editable={true}
              onRatingChange={setUserRating}
            />
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 
            placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={userRating === 0 || comment.trim() === "" || submitting}
            className="self-start rounded-lg bg-sky-500 px-6 py-2 text-sm font-semibold text-white transition-colors 
            hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-sky-500">
            {submitting ? "Posting..." : "Leave a comment"}
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-500">
          Log in to leave a review for this product.
        </p>
      )}

      {loading && (
        <p className="py-6 text-center text-sm text-gray-500">
          Loading reviews...
        </p>
      )}

      {!loading && reviews.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-500">
          No reviews yet. Be the first to review this product!
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="mt-2 flex flex-col divide-y divide-gray-100 border-t border-gray-100">
          {reviews.map((review) => (
            <RateItem
              key={review._id}
              name={review.user?.username ?? "Unknown user"}
              score={review.rating}
              description={review.comment}
              canDelete={
                user?.role === "admin" || user?.id === review.user?._id
              }
              onDelete={() => handleDeleteReview(review._id)}
            />
          ))}
        </div>
      )}

      <PaginationComponent />
    </div>
  );
};

export default RateContainer;
