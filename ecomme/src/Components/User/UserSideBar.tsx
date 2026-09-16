/** @format */

import { NavLink } from "react-router-dom";

const links = [
  { to: "/user/allorders", label: "Order Management" },
  { to: "/user/favoriteproducts", label: "Wishlist" },
  { to: "/user/address", label: "Personal Address" },
  //   { to: "/user/add-address", label: "Add Personal Address" },
  //   { to: "/user/edit-address", label: "Edit Address" },
  { to: "/user/profile", label: "Profile" },
];

const UserSideBar = () => {
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

export default UserSideBar;
