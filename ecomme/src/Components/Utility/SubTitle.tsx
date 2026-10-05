/** @format */
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

const SubTitle = ({
  title,
  btnTitle,
  pathText,
}: {
  title: string;
  btnTitle?: string;
  pathText?: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-5 sm:px-0">
      {/* مسافة يسار توازن الزر: على الشاشات الواسعة فقط، لتمركز العنوان */}
      <div className="hidden flex-1 sm:block" />

      {/* العنوان: يسارًا على الهاتف، ومتمركزًا بخطين على الشاشات الواسعة */}
      <div className="flex min-w-0 items-center gap-4">
        <span className="hidden h-px w-24 shrink-0 bg-sky-500 sm:block" />
        <h2 className="truncate text-lg font-semibold text-gray-900 sm:text-2xl">
          {title}
        </h2>
        <span className="hidden h-px w-24 shrink-0 bg-sky-500 sm:block" />
      </div>

      {/* الزر: لا ينكمش أبدًا تحت عرض محتواه، فلا يتداخل مع العنوان */}
      <div className="flex shrink-0 justify-end sm:flex-1">
        {btnTitle && pathText ? (
          <Link
            to={pathText}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-semibold
            text-sky-500 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 sm:px-3 sm:text-base">
            {btnTitle}
            <MoveRight
              strokeWidth={3}
              className="h-4 w-4 shrink-0 text-gray-400 sm:h-5 sm:w-5"
            />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default SubTitle;
