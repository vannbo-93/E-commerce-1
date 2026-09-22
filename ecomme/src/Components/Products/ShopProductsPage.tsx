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
      <SearchCountResult title="Search results" />
      <div className="flex flex-col gap-4 px-4 md:flex-row">
        <aside className="w-full shrink-0 md:w-64">
          <SideFilter />
        </aside>
        <main className="min-w-0 flex-1">
          <CardProductsContainer />
        </main>
      </div>
      <CustomIcons />
    </div>
  );
};
export default ShopProductsPage;
