/** @format */

import { Link } from "react-router-dom";
import UserAddressCard from "./UserAddressCard";

const UserAllAddress = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-bold text-gray-900">Address Book</div>

      <UserAddressCard />
      <UserAddressCard />

      <div className="flex justify-center">
        <Link
          to="/user/add-address"
          className="inline-flex h-10 items-center rounded-lg bg-sky-500 px-6 text-sm font-semibold 
          text-white no-underline transition-colors hover:bg-sky-600">
          Add New Address
        </Link>
      </div>
    </div>
  );
};

export default UserAllAddress;
