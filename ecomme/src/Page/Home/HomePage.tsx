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
import Reveal from "@/Components/Reveal";

function HomePage() {
  return (
    <>
      <Slide />
      <Reveal>
        <HomeCategory />
      </Reveal>
      <Reveal>
        <CardProductsContainer
          title="Featured Products"
          btntitle="View All"
          pathText="/products?sort=rating"
        />
      </Reveal>
      <Reveal>
        <DiscountSection />
      </Reveal>
      <Reveal>
        <FeaturesBar />
      </Reveal>
      <Reveal>
        <NewArrivals
          title="New Arrivals"
          btntitle="View All"
          pathText="/products"
        />
      </Reveal>
      <Reveal>
        <BrandFeatured title="Top Brands" />
      </Reveal>
      <Reveal>
        <ReviewsContainer title="Customer Reviews" />
      </Reveal>
      <Reveal>
        <Newsletter />
      </Reveal>
    </>
  );
}

export default HomePage;
