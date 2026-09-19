/** @format */
import Slide from "../../Components/Home/slide";
import HomeCategory from "../../Components/Home/HomeCategory";
import CardProductsContainer from "../../Components/Products/CardProductsContainer";
import NewArrivals from "../../Components/Products/NewArrivals";
import DiscountSection from "../../Components/Home/DiscountSection";
import BrandFeatured from "../Brand/BrandFeatured";
import FeaturesBar from "@/Components/Utility/Featuresbar";
import ReviewsContainer from "../../Components/Utility/ReviewsContainer";
import Newsletter from "../../Components/Utility/Newsletter";

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
      <FeaturesBar />
      <NewArrivals
        title="New Arrivals"
        btntitle="View All"
        pathText="/products"
      />
      <BrandFeatured
        title="Top Brands"
        btntitle="View All"
        pathText="/allbrand"
      />
      <ReviewsContainer title="Customer Reviews" />
      <Newsletter />
    </>
  );
};

export default HomePage;
