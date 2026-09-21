/** @format */

import UserAddAddress from "../../Components/User/UserAddAddress";
import UserSideBar from "../../Components/User/UserSideBar";

const UserAddAddressPage = () => {
  return (
    <div className="w-full px-4">
      <div className="flex flex-col gap-4 py-3 md:flex-row">
        <div className="w-full shrink-0 md:w-56">
          <UserSideBar />
        </div>
        <div className="min-w-0 flex-1">
          <UserAddAddress />
        </div>
      </div>
    </div>
  );
};

export default UserAddAddressPage;
