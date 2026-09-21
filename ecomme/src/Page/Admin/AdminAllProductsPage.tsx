/** @format */

import AdminSideBar from "../../Components/Admin/AdminSideBar";
import AdminAllProducts from "../../Components/Admin/AdminAllProducts";
import PaginationComponent from "../../Components/Utility/Pagination";

const AdminAllProductsPage = () => {
  return (
    <div className="w-full px-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <aside className="w-full shrink-0 md:w-56">
          <AdminSideBar />
        </aside>
        <main className="min-w-0 flex-1">
          <AdminAllProducts />
          <PaginationComponent />
        </main>
      </div>
    </div>
  );
};

export default AdminAllProductsPage;
