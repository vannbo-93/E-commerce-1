/** @format */
import { Link } from "react-router-dom";

const SubTitle = ({ title, btnTitle, pathText,
}: { title: string; btnTitle?: string; pathText?: string;}) => {
  return (
    <div className="flex justify-between items-center mb-4 p-3">
      <h2 className="text-lg font-semibold">{title}</h2>

      {btnTitle && pathText ? (
        <Link to={pathText}>
          <button
            className="bg-indigo-950 text-white px-5 py-1.5 rounded-lg
         font-medium transition-colors duration-300 
         hover:bg-indigo-900 cursor-pointer">
            {btnTitle}
          </button>
        </Link>
      ) : null}
    </div>
  );
};

export default SubTitle;
