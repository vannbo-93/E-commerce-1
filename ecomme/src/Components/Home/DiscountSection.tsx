/** @format */
import React from "react";
import laptops from "../../images/laptops.png";

const DiscountSection: React.FC = () => {
  return (
    <div
      className="discount-backcolor flex flex-row-reverse items-center justify-between my-2 w-full h-[180px] rounded-lg 
    border-none shadow-md  overflow-hidden px-4">
      <div className="w-3/4 text-center">
        <div className="discount-title font-bold">
          Up to 30% discount on laptops
        </div>
      </div>
      <div className="w-2/4 flex justify-center">
        <img className="discount-img w-full" src={laptops} alt="" />
      </div>
    </div>
  );
};

export default DiscountSection;
