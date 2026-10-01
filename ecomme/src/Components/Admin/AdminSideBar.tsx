/** @format */

import { useCallback, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import api from "../../Api/baseURL";
import { ADMIN_MESSAGES_CHANGED } from "./adminEvents";

const links = [
  { to: "/admin/allorders", label: "Manage orders" },
  {
    to: "/admin/messages",
    label: "Support messages",
    badge: "messages" as const,
  },
  { to: "/admin/allproducts", label: "Manage products" },
  { to: "/admin/addbrand", label: "Add brand" },
  { to: "/admin/addcategory", label: "Add category" },
  { to: "/admin/addsubcategory", label: "Add subcategory" },
  { to: "/admin/addproducts", label: "Add product" },
];

const AdminSideBar = () => {
  const { pathname } = useLocation();
  const [unread, setUnread] = useState(0);

  const loadUnread = useCallback(() => {
    api
      .get("/contact/admin/unread-count")
      .then((res) => setUnread(res.data.count ?? 0))
      .catch(() => {
        // الشارة إضافة لا أساس: فشلها لا يعطّل القائمة
      });
  }, []);

  // يُحدَّث عند كل تنقل بين صفحات الأدمن، وعند تغيير حالة أي رسالة
  useEffect(() => {
    loadUnread();
  }, [pathname, loadUnread]);

  useEffect(() => {
    window.addEventListener(ADMIN_MESSAGES_CHANGED, loadUnread);
    return () => window.removeEventListener(ADMIN_MESSAGES_CHANGED, loadUnread);
  }, [loadUnread]);

  return (
    <nav className="w-full shrink-0 rounded-2xl bg-white p-3 shadow-[0_2px_16px_rgba(0,0,0,0.08)] md:w-56">
      <div className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `relative flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors duration-200 ${
                isActive
                  ? "bg-sky-500 text-white"
                  : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
              }`
            }>
            {({ isActive }) => (
              <>
                {link.label}
                {link.badge === "messages" && unread > 0 && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                      isActive
                        ? "bg-white text-sky-600"
                        : "bg-red-500 text-white"
                    }`}
                    aria-label={`${unread} unread`}>
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default AdminSideBar;
