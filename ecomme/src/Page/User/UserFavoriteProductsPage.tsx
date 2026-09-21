/** @format */

import UserFavoriteProduct from "../../Components/User/UserFavoriteProduct";
import UserSideBar from "../../Components/User/UserSideBar";

const UserFavoriteProductPage = () => {
  return (
    <div className="w-full px-4">
      <div className="flex flex-col gap-4 py-3 md:flex-row">
        <div className="w-full shrink-0 md:w-56">
          <UserSideBar />
        </div>
        <div className="min-w-0 flex-1">
          <UserFavoriteProduct />
        </div>
      </div>
    </div>
  );
};

export default UserFavoriteProductPage;
