/** @format */

import { useState } from "react";
import RateItem from "./RateItem";
import RatePost from "./RatePost";
import RatingBadge from "./RatingBadge";
import PaginationComponent from "../Utility/Pagination";

// TODO: Replace this with the actual username from the login system.
const CURRENT_USER_NAME = "Mohamed El Aissaoui";

// بيانات تجريبية: استبدلها بتقييمات المنتج القادمة من الـ API
const reviews = [1, 2, 3, 4];

const RateContainer = () => {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  // تغيير هذا المفتاح يجبر ReactStars على إعادة التركيب لأن المكتبة
  // لا تعيد قراءة القيمة بعد التحميل الأول.
  const [widgetKey, setWidgetKey] = useState(0);

  const handleSubmit = () => {
    if (userRating === 0 || comment.trim() === "") return;
    // TODO: Replace this with an actual API call to submit the rating.
    console.log({ rating: userRating, comment });
    setComment("");
    setUserRating(0);
    setWidgetKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-900">Reviews</span>
        <RatingBadge score={4.3} />
        <span className="text-sm text-gray-400">(160 reviews)</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">{CURRENT_USER_NAME}</span>
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
        disabled={userRating === 0 || comment.trim() === ""}
        className="self-start rounded-lg bg-sky-500 px-6 py-2 text-sm font-semibold text-white transition-colors 
        hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-sky-500">
        Leave a comment
      </button>

      <div className="mt-2 flex flex-col divide-y divide-gray-100 border-t border-gray-100">
        {reviews.map((id) => (
          <RateItem key={id} />
        ))}
      </div>

      <div className="flex justify-center">
        <PaginationComponent />
      </div>
    </div>
  );
};

export default RateContainer;
