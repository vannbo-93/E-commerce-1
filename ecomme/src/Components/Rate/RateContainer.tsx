/** @format */

import { useState } from "react";
import RateItem from "./RateItem";
import RatePost from "./RatePost";
import RatingBadge from "./RatingBadge";
import PaginationComponent from "../Utility/Pagination";

// TODO: استبدل هذا باسم المستخدم الفعلي من نظام تسجيل الدخول لديك
const CURRENT_USER_NAME = "Mohamed El Aissaoui";

const RateContainer = () => {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  // مفتاح ديناميكي: تغييره يجبر React على إعادة تركيب ReactStars بالكامل،
  // لأن المكتبة لا تعيد قراءة value بعد أول تحميل (انظر الشرح أعلاه)
  const [widgetKey, setWidgetKey] = useState(0);

  const handleSubmit = () => {
    if (userRating === 0 || comment.trim() === "") return;
    // TODO: استبدل هذا باستدعاء API فعلي لإرسال التقييم للسيرفر
    console.log({ rating: userRating, comment });
    setComment("");
    setUserRating(0);
    setWidgetKey((prev) => prev + 1);
  };

  return (
    <div className="rate-container" dir="rtl">
      <div className="flex items-center gap-2">
        <span className="font-bold">feedbacks</span>
        <RatingBadge score={4.3} />
        <span className="text-gray-400">(160 evaluation)</span>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="font-semibold">{CURRENT_USER_NAME}</span>
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
        className="w-full border border-gray-300 rounded-lg p-3 mt-2 text-gray-800 
        focus:outline-none focus:ring-1 focus:ring-gray-400"
      />

      <button
        onClick={handleSubmit}
        disabled={userRating === 0 || comment.trim() === ""}
        className="bg-black text-white rounded-md px-4 py-2 mt-2 hover:bg-gray-800 
        disabled:opacity-40 disabled:cursor-not-allowed transition">
        Leave a comment
      </button>

      <div className="mt-4">
        <RateItem />
        <RateItem />
        <RateItem />
        <RateItem />
      </div>

      <PaginationComponent />
    </div>
  );
};

export default RateContainer;
