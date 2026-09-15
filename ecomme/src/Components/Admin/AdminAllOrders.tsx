/** @format */

import AdminAllOrderProduct from "./AdminAllOrderProduct";

const AdminAllOrder = () => {
  return (
    <div className="p-4">
      <div className="text-xl font-bold text-gray-200 mb-4">
        Manage All Orders
      </div>
      <div className="grid grid-cols-1 gap-4">
        <AdminAllOrderProduct />
        <AdminAllOrderProduct />
      </div>
    </div>
  );
};

export default AdminAllOrder;
