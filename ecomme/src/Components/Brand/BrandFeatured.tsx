/** @format */
import BrandCard from "./BrandCard";
import SubTitle from "../Uitily/SubTitle.js";
import brand1 from "../../images/brand1.png";
import brand2 from "../../images/brand2.png";
import brand3 from "../../images/brand3.png";

const BrandFeatured = ({title,btntitle,}: {title: string;btntitle: string;}) => {
  return (
    <div className="my-3">
      <div>
        <SubTitle title={title} btnTitle={btntitle} />
        <div className="flex items-center justify-between my- m-4 overflow-x-auto ">
          <BrandCard img={brand1} />
          <BrandCard img={brand2} />
          <BrandCard img={brand3} />
          <BrandCard img={brand1} />
          <BrandCard img={brand2} />
        </div>
      </div>
    </div>
  );
};

export default BrandFeatured;
