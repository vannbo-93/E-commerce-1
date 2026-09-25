/** @format */
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // نفس مدة فحص /user/me الأولى؛ عرض فارغ بسيط بدل وميض الصفحة المحمية للحظة قبل الطرد
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
