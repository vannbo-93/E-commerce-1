/** @format */
import SubTitle from "../Utility/SubTitle";
import CategoryCard from "../../Page/Category/CategoryCard";
import camera from "../../../src/images/allProducts/camera.png";
import controller from "../../../src/images/allProducts/controller.png";
import smartphone from "../../../src/images/allProducts/smartphone.png";
import watch from "../../../src/images/allProducts/smartwatch.png";
import microphone from "../../../src/images/allProducts/microphone.png";

const HomeCategory = () => {
  return (
    <>
      <SubTitle
        title="Shop by Category"
        btnTitle="View All Category"
        pathText="/allcategory"
      />
      <div className="flex items-center justify-between my-2 m-12 ">
        <CategoryCard title="Cameras" img={camera} />
        <CategoryCard title="Gaming" img={controller} />
        <CategoryCard title="Smartphones" img={smartphone} />
        <CategoryCard title="Smartwatches" img={watch} />
        <CategoryCard title="Microphones" img={microphone} />
      </div>
    </>
  );
};

export default HomeCategory;
