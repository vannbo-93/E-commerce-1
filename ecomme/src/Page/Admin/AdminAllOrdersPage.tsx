/** @format */

import AdminSideBar from "../../Components/Admin/AdminSideBar";
import PaginationCompontent from "../../Components/Utility/Pagination";
import AdminAllOrders from "../../Components/Admin/AdminAllOrders";

const AdminAllOrdersPage = () => {
  return (
    <div className="py-3">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[16.66%]">
          <AdminSideBar />
        </div>
        <div className="w-full md:w-[83.33%]">
          <AdminAllOrders />
          <PaginationCompontent />
        </div>
      </div>
    </div>
  );
};

export default AdminAllOrdersPage;
