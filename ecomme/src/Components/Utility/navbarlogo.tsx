/** @format */
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import shop from "../../../src/images/Logo/shop.png";
import AccountMenu from "./AccountMenu";
import { Heart } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Brands", path: "/brands" },
  { label: "Support", path: "/support" },
];

interface NavBarLogoProps {
  cartCount?: number; // اربطه بحالة السلة الفعلية
  accountPath?: string; // صفحة الحساب أو تسجيل الدخول
  favoritesCount?: number;
}

function NavBarLogo({ cartCount = 0, favoritesCount = 0 }: NavBarLogoProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // عدّل المسار حسب صفحة نتائج البحث عندك
    navigate(`/products?search=${encodeURIComponent(q)}`);
    closeMenu();
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors duration-200 hover:text-sky-500 ${
      isActive ? "text-sky-500" : "text-gray-700"
    }`;

  const searchForm = (className: string) => (
    <form onSubmit={handleSearch} role="search" className={className}>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}  placeholder="Search"
        aria-label="Search products" className="w-full rounded-lg border border-gray-200 bg-gray-100 py-2 pl-9 pr-3 text-sm text-gray-900 outline-none 
        transition-colors placeholder:text-gray-400 focus:border-sky-400"/>
    </form>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-4 px-4 md:h-20 md:px-6">
        {/* الشعار */}
        <Link to="/" className="shrink-0" onClick={closeMenu}>
          <img src={shop} alt="Shop logo" className="h-15 w-auto md:h-22" />
        </Link>

        {/* الروابط: تظهر على الشاشات المتوسطة فما فوق */}
        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={linkClass}>
              {" "}
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* الجهة اليمنى */}
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {searchForm("relative hidden w-40 md:block lg:w-64")}

          <Link
            to="/user/favorite"
            aria-label={`Wishlist, ${favoritesCount} items`}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-sky-500 sm:flex">
            <Heart size={22} />
            {favoritesCount > 0 ? (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-xs font-semibold text-white">
                {favoritesCount > 99 ? "99+" : favoritesCount}
              </span>
            ) : null}
          </Link>

          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-sky-500">
            <ShoppingCart size={22} />
            {cartCount > 0 ? (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-xs font-semibold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>
          <AccountMenu user={null} />

          {/* زر القائمة: على الموبايل فقط */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 md:hidden">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      {menuOpen ? (
        <div className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white px-4 pb-4 pt-3 shadow-md md:hidden">
          {searchForm("relative mb-3")}
          <div className="flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={closeMenu}
                className={(state) =>
                  `${linkClass(state)} rounded-md px-2 py-3 hover:bg-gray-50`
                }>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

export default NavBarLogo;
