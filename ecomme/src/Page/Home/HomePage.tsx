/** @format */
import Slide from "../../Components/Home/slide";
import HomeCategory from "../../Components/Home/HomeCategory";
import CardProductsContainer from "../../Components/Products/CardProductsContainer";
import DiscountSection from "../../Components/Home/DiscountSection";
import BrandFeatured from "../../Components/Brand/BrandFeatured";
import Footer from "../../Components/Uitily/Footer";

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
      <BrandFeatured title="Featured Products" btntitle="View All" />
      <Footer />
    </>
  );
};

export default HomePage;
