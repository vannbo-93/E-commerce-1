/** @format */
import AdminSideBar from "../../Components/Admin/AdminSideBar";
import AdminAddBrand from "../../Components/Admin/AdminAddBrand";

const AdminAddbrandPage = () => {
  return (
    <div className="w-full pl-4 pr-8">
      <div className="flex flex-col sm:flex-row py-3 gap-4">
        <div className="w-full sm:w-5/12 md:w-2/12">
          <AdminSideBar />
        </div>
        <div className="w-full sm:w-7/12 md:w-10/12">
          <AdminAddBrand />
        </div>
      </div>
    </div>
  );
};

export default AdminAddbrandPage;
