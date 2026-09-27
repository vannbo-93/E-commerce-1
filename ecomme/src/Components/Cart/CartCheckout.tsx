/** @format */
import React from "react";
import { Link } from "react-router-dom";

interface CartCheckoutProps {
  total: number;
  itemsCount: number;
  // true أثناء أي تعديل على السلة: يمنع الانتقال للدفع بإجمالي لم يُحدَّث بعد
  busy?: boolean;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

// المسار كما هو في الـ Router حاليًا (فيه خطأ إملائي، يُصلَح مع صفحة الدفع)
const CHECKOUT_PATH = "/order/paymethoud";

// لا حقل كوبون: لا يوجد نظام كوبونات في الباك إند بعد، فلا نعرض حقلًا لا يعمل.
// ولا نمرر total عبر state: صفحة الدفع يجب ألا تثق بأي رقم من المتصفح،
// الباك إند يحسب الإجمالي بنفسه عند إنشاء الطلب.
const CartCheckout: React.FC<CartCheckoutProps> = ({
  total,
  itemsCount,
  busy = false,
}) => {
  const canCheckout = itemsCount > 0 && !busy;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]">
      <h3 className="mb-4 text-base font-semibold text-gray-900">
        Order Summary
      </h3>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Items ({itemsCount})</span>
        <span className="font-medium text-gray-900">{formatPrice(total)}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-sm font-medium text-gray-500">Total</span>
        <span className="text-xl font-bold text-gray-900">
          {formatPrice(total)}
        </span>
      </div>

      {canCheckout ? (
        <Link
          to={CHECKOUT_PATH}
          className="mt-4 block w-full rounded-lg bg-sky-500 py-3 text-center font-semibold text-white no-underline transition-colors 
          hover:bg-sky-600">
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
