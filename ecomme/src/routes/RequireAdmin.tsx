/** @format */
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAdmin = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    // غير مسجّل دخول إطلاقًا → صفحة الدخول
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // مسجّل دخول، لكن بلا صلاحية أدمن → الصفحة الرئيسية بدل صفحة دخول لن تفيده
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
