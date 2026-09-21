/** @format */
import AdminSideBar from "../../Components/Admin/AdminSideBar";
import AdminAddBrand from "../../Components/Admin/AdminAddBrand";

const AdminAddbrandPage = () => {
  return (
    <div className="w-full px-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full shrink-0 md:w-56">
          <AdminSideBar />
        </div>
        <div className="min-w-0 flex-1">
          <AdminAddBrand />
        </div>
      </div>
    </div>
  );
};

export default AdminAddbrandPage;
