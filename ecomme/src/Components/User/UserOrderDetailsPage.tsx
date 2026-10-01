/** @format */
import UserOrderDetails from "../../Components/User/UserOrderDetails";
import UserSideBar from "../../Components/User/UserSideBar";

const UserOrderDetailsPage = () => {
  return (
    <div className="w-full px-4">
      <div className="flex flex-col gap-4 py-3 md:flex-row">
        <aside className="w-full shrink-0 md:w-56">
          <UserSideBar />
        </aside>
        <main className="min-w-0 flex-1">
          <UserOrderDetails />
        </main>
      </div>
    </div>
  );
};

export default UserOrderDetailsPage;
