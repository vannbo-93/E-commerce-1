/** @format */

import AdminSideBar from "../../Components/Admin/AdminSideBar";
import AdminAllProducts from "../../Components/Admin/AdminAllProducts";
import PaginationCompontent from "../../Components/Utility/Pagination";

const AdminAllProductsPage = () => {
  return (
    <div className="w-full pl-4 pr-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[16.66%]">
          <AdminSideBar />
        </div>
        <div className="w-full md:w-[83.33%]">
          <AdminAllProducts />
          <PaginationCompontent />
        </div>
      </div>
    </div>
  );
};

export default AdminAllProductsPage;
