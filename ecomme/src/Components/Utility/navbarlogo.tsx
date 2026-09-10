/** @format */
import { Search, Box, ShoppingCart } from "lucide-react";
import mohamed from "../../images/mohamed.jpg";

function NavBarLogo() {
  return (
    <nav className="w-full h-16 bg-[#12141c] border-b border-white/5 flex items-center px-6 gap-6">
      {/* Logo */}
      <div className="flex items-center shrink-0">
        <Box />
      </div>

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
        <ShoppingCart className="mr-1" />
        <img
          src={mohamed}
          alt="User avatar"
          className="w-6 h-6 rounded-full object-cover border border-white/10"
        />
      </div>
    </nav>
  );
}
export default NavBarLogo;
