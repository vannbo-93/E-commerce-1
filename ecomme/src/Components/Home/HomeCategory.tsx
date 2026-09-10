/** @format */
import SubTitle from "../Utility/SubTitle";
import CategoryCard from "../../Page/Category/CategoryCard";
import clothe1 from "../../images/clothe1.png";
import cream from "../../images/cream.png";
import laptop from "../../images/laptop.png";
import pot from "../../images/pot.png";
import grands from "../../images/grands.png";

const HomeCategory = () => {
  return (
    <>
      <SubTitle title="categories" btnTitle="next" pathText="/allcategory" />
      <div className="flex items-center justify-between my-2 m-12 ">
        <CategoryCard title="Clothing" img={clothe1} />
        <CategoryCard title="Skincare" img={cream} />
        <CategoryCard title="Electronics" img={laptop} />
        <CategoryCard title="Home Decor" img={grands} />
        <CategoryCard title="Kitchenware" img={pot} />
      </div>
    </>
  );
};

export default HomeCategory;
