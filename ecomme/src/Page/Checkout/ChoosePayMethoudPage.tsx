/** @format */

import { Navigate, useLocation } from "react-router-dom";
import ChoosePayMethoud from "../../Components/Checkout/ChoosePayMethoud";

const ChoosePayMethoudPage = () => {
  const location = useLocation();
  const total = Number(
    (location.state as { total?: number } | null)?.total ?? 0,
  );

  // بلا مجموع صالح (فتح مباشر للرابط أو سلة فارغة) لا معنى للدفع
  if (!Number.isFinite(total) || total <= 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleConfirm = () => {
    // placeholder for payment confirmation flow
  };

  return (
    <div>
      <ChoosePayMethoud total={total} onConfirm={handleConfirm} />
    </div>
  );
};
export default ChoosePayMethoudPage;
