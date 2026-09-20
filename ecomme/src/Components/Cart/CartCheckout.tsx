/** @format */
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface CartCheckoutProps {
  total: number;
  onApplyCoupon?: (code: string) => void;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

// المسار كما كان في ملفك، وفيه على الأرجح خطأ إملائي (paymethoud)
const CHECKOUT_PATH = "/order/paymethoud";

const CartCheckout: React.FC<CartCheckoutProps> = ({
  total,
  onApplyCoupon,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const canApply = couponCode.trim().length > 0;
  const canCheckout = total > 0;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (canApply && onApplyCoupon) {
      onApplyCoupon(couponCode.trim());
    }
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]">
      <h3 className="mb-4 text-base font-semibold text-gray-900">
        Order Summary
      </h3>

      {/* الكوبون: min-w-0 يسمح للحقل بالانكماش فلا يُقص الزر */}
      <form onSubmit={handleApply} className="flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition-colors
           placeholder:text-gray-400 focus:border-sky-400"
          placeholder="Coupon code"
          aria-label="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button
          type="submit"
          disabled={!canApply}
          className="shrink-0 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-600 
          disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500">
          Apply
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-sm font-medium text-gray-500">Total</span>
        <span className="text-xl font-bold text-gray-900">
          {formatPrice(total)}
        </span>
      </div>
      
      {canCheckout ? (
        <Link
          to={CHECKOUT_PATH}
          state={{ total }}
          className="mt-4 block w-full rounded-lg bg-sky-500 py-3 text-center font-semibold text-white no-underline transition-colors hover:bg-sky-600">
          Checkout
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="mt-4 block w-full cursor-not-allowed rounded-lg bg-gray-200 py-3 text-center font-semibold text-gray-400">
          Checkout
        </span>
      )}
    </div>
  );
};
export default CartCheckout;
