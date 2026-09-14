/** @format */
import { Search, Box } from "lucide-react";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { Badge, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import mohamed from "../../images/mohamed.jpg";
import { Link } from "react-router-dom";

function NavBarLogo() {
  const navigate = useNavigate();
  const handlerCart = () => {
    navigate("/cart");
  };
  return (
    <nav className="w-full h-16 bg-[#12141c] border-b border-white/5 flex items-center px-6 gap-6">
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center shrink-0">
          <Box />
        </div>
      </Link>
      {/* Search bar - centered */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-white/40 
            outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Right side: notifications + avatar */}
      <div className="flex items-center gap-4 shrink-0">
        <IconButton aria-label="cart" onClick={handlerCart}>
          <Badge badgeContent={4} color="secondary">
            <ShoppingCart sx={{ color: "#ffffff" }} />
          </Badge>
        </IconButton>
        <img
          src={mohamed}
          alt="User avatar"
          className="w-8 h-8 rounded-full object-cover border border-white/10 cursor-pointer"
        />
      </div>
    </nav>
  );
}
export default NavBarLogo;
