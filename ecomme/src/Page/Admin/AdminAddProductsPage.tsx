/** @format */
import AdminSideBar from "../../Components/Admin/AdminSideBar";
import AdminAddProducts from "../../Components/Admin/AdminAddProducts";

const AdminAddCategoryPage = () => {
  return (
    <div className="w-full pl-4 pr-8">
      <div className="flex flex-col sm:flex-row py-3 gap-4">
        <div className="w-full md:w-[16.66%]">
          <AdminSideBar />
        </div>
        <div className="w-full sm:w-7/12 md:w-10/12">
          <AdminAddProducts />
        </div>
      </div>
    </div>
  );
};

export default AdminAddCategoryPage;
