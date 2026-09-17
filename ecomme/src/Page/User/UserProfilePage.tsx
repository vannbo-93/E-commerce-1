/** @format */
/** @format */

import UserProfile from "../../Components/User/UserProfile";
import UserSideBar from "../../Components/User/UserSideBar";

const UserProfilePage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row py-3 gap-4">
        <div className="w-full sm:w-3/12 md:w-2/12">
          <UserSideBar />
        </div>
        <div className="w-full sm:w-9/12 md:w-10/12">
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
