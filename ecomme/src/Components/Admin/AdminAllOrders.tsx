/** @format */

import AdminAllOrderProduct from "./AdminAllOrderProduct";

const AdminAllOrder = () => {
  return (
    <div className="p-4">
      <div className="admin-content-text text-lg font-semibold !mb-8 !text-black">
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

