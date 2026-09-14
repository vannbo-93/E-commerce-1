/** @format */

import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/allorders", label: "Manage orders" },
  { to: "/admin/allproducts", label: "Manage products" },
  { to: "/admin/addbrand", label: "Add brand" },
  { to: "/admin/addcategory", label: "Add category" },
  { to: "/admin/addsubcategory", label: "Add subcategory" },
  { to: "/admin/addproducts", label: "Add product" },
];

const AdminSideBar = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `no-underline block text-center py-2.5 px-3 mt-1 border-b border-white/5
             text-sm transition-colors duration-200 rounded-lg
              ${
                isActive
                  ? "bg-blue-500/15 text-blue-400 font-medium"
                  : "text-gray-300 hover:bg-white/5 hover:text-blue-400"
              }`
            }>
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSideBar;
