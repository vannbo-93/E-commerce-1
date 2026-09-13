/** @format */
import CategoryHeader from "../../Page/Category/CategoryHeader";
import SearchCountResult from "../../Components/Utility/SearchCountResult";
import SideFilter from "../../Components/Utility/SideFilter";
import CardProductsContainer from "./CardProductsContainer";
import CustomIcons from "../Utility/Pagination";

const ShopProductsPage = () => {
  return (
    <div>
      <CategoryHeader />
      <SearchCountResult title=" Search results " />
      <div className="flex">
        <SideFilter />
        <CardProductsContainer />
      </div>
      <CustomIcons />
    </div>
  );
};
export default ShopProductsPage;
