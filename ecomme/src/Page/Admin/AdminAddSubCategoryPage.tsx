/** @format */
/** @format */
import AdminSideBar from "../../Components/Admin/AdminSideBar";
import AdminAddSubCategory from "../../Components/Admin/AdminAddSubCategory";

const AdminAddSubCategoryPage = () => {
  return (
    <div className="w-full px-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full shrink-0 md:w-56">
          <AdminSideBar />
        </div>
        <div className="min-w-0 flex-1">
          <AdminAddSubCategory />
        </div>
      </div>
    </div>
  );
};

export default AdminAddSubCategoryPage;
