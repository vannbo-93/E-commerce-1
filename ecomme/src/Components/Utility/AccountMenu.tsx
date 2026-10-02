/** @format */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CircleUser,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  Package,
  User,
  UserPlus,
} from "lucide-react";
import UserAvatar from "./UserAvatar";

interface AccountMenuProps {
  // null = زائر غير مسجّل
  user?: { name: string; email?: string; avatar?: string | undefined } | null;
  isAdmin?: boolean;
  onLogout?: () => void;
}

// المسارات مطابقة لـ App.tsx (ثلاثة منها كانت تقود إلى "Page not found")
const userItems = [
  { label: "My Profile", path: "/user/profile", icon: User },
  { label: "My Orders", path: "/user/allorders", icon: Package },
  { label: "Wishlist", path: "/user/favoriteproducts", icon: Heart },
  { label: "Addresses", path: "/user/address", icon: MapPin },
];

const itemClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 no-underline transition-colors hover:bg-gray-100 hover:text-sky-500";

const AccountMenu = ({
  user = null,
  isAdmin = false,
  onLogout,
}: AccountMenuProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // إغلاق عند الضغط خارج القائمة أو بزر Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100
        hover:text-sky-500">
        {/* المسجّل يرى صورته (أو حروفه الأولى)، والزائر الأيقونة العامة */}
        {user ? (
          <UserAvatar name={user.name} src={user.avatar} size={32} />
        ) : (
          <CircleUser size={24} />
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          {user ? (
            <>
              <div className="flex items-center gap-3 border-b border-gray-100 px-3 pb-3 pt-2">
                <UserAvatar name={user.name} src={user.avatar} size={40} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-gray-900">
                    {user.name}
                  </div>
                  {user.email ? (
                    <div className="truncate text-xs text-gray-500">
                      {user.email}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="py-2">
                {userItems.map(({ label, path, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    role="menuitem"
                    onClick={close}
                    className={itemClass}>
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}

                {isAdmin ? (
                  <Link
                    to="/admin/allorders"
                    role="menuitem"
                    onClick={close}
                    className={itemClass}>
                    <LayoutDashboard size={18} />
                    Admin Dashboard
                  </Link>
                ) : null}
              </div>

              <div className="border-t border-gray-100 pt-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    close();
                    onLogout?.();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50">
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <Link
                to="/login"
                role="menuitem"
                onClick={close}
                className={itemClass}>
                <LogIn size={18} /> Sign in
              </Link>
              <Link
                to="/register"
                role="menuitem"
                onClick={close}
                className={itemClass}>
                <UserPlus size={18} /> Create account
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AccountMenu;
