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
    <nav className="w-full shrink-0 rounded-2xl bg-white p-3 shadow-[0_2px_16px_rgba(0,0,0,0.08)] md:w-56">
      <div className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2.5 text-center text-sm font-medium no-underline transition-colors duration-200 ${
                isActive
                  ? "bg-sky-500 text-white"
                  : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
              }`
            }>
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default AdminSideBar;
