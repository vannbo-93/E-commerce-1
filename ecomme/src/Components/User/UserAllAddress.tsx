/** @format */

import { Link } from "react-router-dom";
import UserAddressCard from "./UserAddressCard";

const UserAllAddress = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="admin-content-text text-lg font-bold text-white mb-4">
        Address Book</div>

      <UserAddressCard />
      <UserAddressCard />

      <div className="flex justify-center">
        <Link to="/user/add-address" className="no-underline">
          <button className=" h-10 px-6 rounded-md bg-blue-500 text-white 
          text-sm font-semibold hover:bg-blue-600 transition-colors">
            Add New Address
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserAllAddress;
