/** @format */

import UserAllOrderCard from "./UserAllOrderCard";

const UserAllOrdersItem = () => {
  return (
    <div className="user-order mt-2">
      <div className="py-2 order-title font-bold">Order #234556</div>

      <UserAllOrderCard />
      <UserAllOrderCard />

      <div className="flex justify-between pl-3">
        <div>
          <span className="inline font-bold">Status :</span>
          <span className="inline mx-2 stat font-bold">In progress</span>
        </div>

        <div className="flex justify-end">
          <div className="barnd-text font-bold pr-5">4000 MAD</div>
        </div>
      </div>
    </div>
  );
};

export default UserAllOrdersItem;
