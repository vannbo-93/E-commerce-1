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
    <div className="flex items-center justify-between gap-2 py-3 pt-5">
      {/* مسافة فارغة يسار - توازن الزر لتمركز العنوان فعليًا */}
      <div className="flex-1 min-w-0" />

      {/* العنوان مع الخطوط - قابلة للانكماش تدريجيًا بلا قفزات */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <span className="h-px w-4 sm:w-24 min-w-[8px] shrink bg-sky-500" />
        <h2 className="text-base sm:text-2lg font-semibold text-gray-900 whitespace-nowrap shrink-0">
          {title}
        </h2>
        <span className="h-px w-4 sm:w-24 min-w-[8px] shrink bg-sky-500" />
      </div>

      {/* زر View All Category - أقصى اليمين دائمًا */}
      <div className="flex-1 flex justify-end min-w-0">
        {btnTitle && pathText ? (
          <Link to={pathText} className="shrink-0">
            <div
              className="flex items-center font-bold hover:bg-gray-50 cursor-pointer text-sky-400
              hover:-translate-y-0.5 transition-all duration-200 p-4">
              <button
                className="text-sky px-2 sm:px-3 py-1.5 rounded-lg
                font-medium text-sm sm:text-base transition-colors duration-300
                whitespace-nowrap">
                {btnTitle}
              </button>
              <MoveRight
                strokeWidth={3}
                className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 shrink-0"
              />
            </div>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default SubTitle;
