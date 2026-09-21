/** @format */

import UserAllOrderCard from "./UserAllOrderCard";

const statusStyles: Record<string, string> = { "In progress": "bg-sky-50 text-sky-600", 
  Completed: "bg-green-50 text-green-700", Cancelled: "bg-red-50 text-red-600",
};

interface UserAllOrdersItemProps { orderId?: string; status?: string; total?: number;}

const UserAllOrdersItem = ({ orderId = "234556", status = "In progress", total = 4000,}: UserAllOrdersItemProps) => {
  return (
    <div className="mt-2 rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <div className="font-bold text-gray-900">Order #{orderId}</div>

      <div className="mt-3 border-t border-gray-100 pt-3">
        <UserAllOrderCard />
        <UserAllOrderCard />
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Status:</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              statusStyles[status] ?? "bg-gray-100 text-gray-600"
            }`}>
            {status}
          </span>
        </div>

        <span className="text-base font-bold text-gray-900">
          {total.toLocaleString("en-US")} $
        </span>
      </div>
    </div>
  );
};

export default UserAllOrdersItem;
