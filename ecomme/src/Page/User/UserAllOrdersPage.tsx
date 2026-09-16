/** @format */
import UserAllOrders from "../../Components/User/UserAllOrders";
import UserSideBar from "../../Components/User/UserSideBar";

const UserAllOrdersPage = () => {
  return (
    <div className="w-full px-4">
      <div className="flex flex-col sm:flex-row py-3 gap-4">
        <div className="w-full sm:w-3/12 md:w-2/12">
          <UserSideBar />
        </div>
        <div className="w-full sm:w-9/12 md:w-10/12">
          <UserAllOrders />
        </div>
      </div>
    </div>
  );
};

export default UserAllOrdersPage;
