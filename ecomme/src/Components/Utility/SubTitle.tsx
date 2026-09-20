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
    <div className="flex justify-between items-center pt-5 p-5 ">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="hover:bg-gray-50 cursor-pointer font-bold text-sky-400  
       hover:-translate-y-0.5 transition-all duration-200">
        {btnTitle && pathText ? (
          <Link to={pathText}>
            <div className="flex items-center font-bold">
              <button
                className=" text-sky px-5 py-1.5 rounded-lg
         font-medium transition-colors duration-300 
         ">
                {btnTitle}
              </button>
              <MoveRight strokeWidth={3} className=" text-gray-400  " />
            </div>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default SubTitle;
