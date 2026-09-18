/** @format */
import { Search, Box } from "lucide-react";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { Badge, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import mohamed from "../../images/mohamed.jpg";
import { Link } from "react-router-dom";
import { CircleUser } from "lucide-react";
import { NavLink } from "react-router-dom";

function NavBarLogo() {
  const navigate = useNavigate();
  const handlerCart = () => {
    navigate("/cart");
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Brands", path: "/brands" },
    { label: "Support", path: "/support" },
  ];
  return (
    <nav className="w-full h-16 border-b border-white/5 flex items-center px-6 gap-6">
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center shrink-0">
          <Box />
        </div>
      </Link>

      <div className="flex flex-2 justify-center gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative text-sm font-medium transition-all duration-200 
            hover:-translate-y-0.5 hover:text-sky-500
            ${isActive ? "text-sky-500" : "text-gray-700"}`
            }>
            {item.label}
          </NavLink>
        ))}
      </div>
      {/* Search bar - centered */}
      <div className="flex-1 flex justify-end">
        {/* Right side: notifications + avatar */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 
      outline-none focus:border-gray-500 transition-colors"
            />
          </div>
          <IconButton
            aria-label="cart"
            onClick={handlerCart}
            className="text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors rounded-full">
            <Badge badgeContent={1} color="secondary">
              <ShoppingCart className="w-5 h-5" />
            </Badge>
          </IconButton>

          {/* <Link
            to="admin/allproducts"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"> */}
          <CircleUser className="w-6 h-6" />
          {/* </Link> */}
        </div>
      </div>
    </nav>
  );
}
export default NavBarLogo;
