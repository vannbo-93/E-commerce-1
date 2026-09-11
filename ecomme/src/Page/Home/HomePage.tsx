/** @format */
import Slide from "../../Components/Home/slide";
import HomeCategory from "../../Components/Home/HomeCategory";
import CardProductsContainer from "../../Components/Products/CardProductsContainer";
import DiscountSection from "../../Components/Home/DiscountSection";
import BrandFeatured from "../Brand/BrandFeatured";

const HomePage = () => {
  return (
    <>
      <Slide />
      <HomeCategory />
      <CardProductsContainer
        title="Featured Products"
        btntitle="View All"
        pathText="/products"
      />
      <DiscountSection />
      <BrandFeatured
        title="Featured Brands"
        btntitle="View All"
        pathText="/allbrand"
      />
    </>
  );
};

export default HomePage;
