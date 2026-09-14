/** @format */
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface CartCheckoutProps {
  total: number;
  onApplyCoupon?: (code: string) => void;}

const CartCheckout: React.FC<CartCheckoutProps> = ({ total,onApplyCoupon,}) => {
  const [couponCode, setCouponCode] = useState("");

  const handleApply = () => {if (couponCode.trim() && onApplyCoupon) {
      onApplyCoupon(couponCode.trim()); }
  };

  return (
    <div className="border border-gray-700 rounded-xl p-4 sticky top-4">
      <h3 className="text-sm font-semibold mb-3 font-bold">Order Summary</h3>

      <div className="flex rounded-lg overflow-hidden border border-gray-600">
        <input
          className="flex-1 text-center px-2 py-2 bg-transparent focus:outline-none text-sm"
          placeholder="Coupon code"value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}/>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium 
          hover:bg-blue-700 transition-colors font-bold">
          Apply
        </button>
      </div>

      <div className="flex justify-between items-center mt-4 py-3 
      border-t border-gray-700">
        <span className="text-sm text-gray-400 font-bold">Total</span>
        <span className="text-lg font-bold">{total} MAD</span>
      </div>

      <Link to="/order/paymethoud" className="block no-underline">
        <button className="w-full py-3 rounded-lg bg-black text-white font-semibold
         hover:bg-gray-800 transition-colors">
          Checkout
        </button>
      </Link>
    </div>
  );
};

export default CartCheckout;
