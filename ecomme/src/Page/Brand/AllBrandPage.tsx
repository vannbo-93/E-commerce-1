/** @format */
import BrandCard from "./BrandCard.js";
import SubTitle from "../../Components/Utility/SubTitle.js";
import brand1 from "../../images/brand1.png";
import brand2 from "../../images/brand2.png";
import brand3 from "../../images/brand3.png";

const AllBrandPage = ({ title, pathText,
}: { title: string; pathText: string;}) => {
  return (
    <div>
      <div>
        <SubTitle title={title} pathText={pathText} />
        <div className="grid grid-cols-4 gap-4 my-2 mx-12 ">
          <BrandCard img={brand1} />
          <BrandCard img={brand2} />
          <BrandCard img={brand3} />
          <BrandCard img={brand1} />
          <BrandCard img={brand2} />
          <BrandCard img={brand1} />
          <BrandCard img={brand2} />
          <BrandCard img={brand3} />
          <BrandCard img={brand1} />
          <BrandCard img={brand2} />
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

export default AllBrandPage;
