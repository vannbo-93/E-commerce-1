/** @format */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconChevronRight, IconPackage } from "@tabler/icons-react";
import api from "../../Api/baseURL";
import OrderStatusBadge from "./OrderStatusBadge";
import {
  apiErrorMessage,
  formatDate,
  formatPrice,
  type OrderSummary,
} from "./orderUi";

interface OrdersPage {
  orders: OrderSummary[];
  page: number;
  pages: number;
}

const UserAllOrders = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<OrdersPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- إظهار التحميل عند تغيير الصفحة
    setLoading(true);
    setError("");
    api
      .get(`/order/my?page=${page}`)
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const heading = (
    <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
  );

  if (loading && !data) {
    return (
      <div className="flex flex-col gap-5">
        {heading}
        <p className="py-10 text-center text-sm text-gray-500">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-5">
        {heading}
        <p className="py-10 text-center text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!data || data.orders.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        {heading}
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-14 text-center 
        shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <IconPackage size={28} />
          </div>
          <p className="text-base font-semibold text-gray-900">
            You haven't placed any orders yet
          </p>
          <p className="text-sm text-gray-500">
            When you place an order, you'll be able to track it here.
          </p>
          <Link
            to="/products"
            className="mt-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-medium text-white no-underline 
            transition-colors hover:bg-sky-600">
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {heading}

      <ul
        className={`flex flex-col gap-3 transition-opacity ${loading ? "opacity-50" : ""}`}
        aria-busy={loading}>
        {data.orders.map((order) => (
          <li key={order._id}>
            <Link
              to={`/user/orders/${order._id}`}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 text-gray-900 no-underline 
              shadow-[0_2px_16px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]">
              {/* معاينة صور المنتجات */}
              <div className="flex shrink-0 -space-x-3">
                {order.previewImages.length > 0 ? (
                  order.previewImages.map((img, i) => (
                    <img
                      key={`${img}-${i}`}
                      src={img}
                      alt=""
                      className="h-12 w-12 rounded-lg border-2 border-white bg-gray-50 object-contain"
                    />
                  ))
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 text-gray-300">
                    <IconPackage size={20} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">
                    Order #{order.orderNumber}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {formatDate(order.createdAt)} · {order.itemsCount}{" "}
                  {order.itemsCount === 1 ? "item" : "items"}
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold">{formatPrice(order.total)}</div>
              </div>
              <IconChevronRight size={18} className="shrink-0 text-gray-400" />
            </Link>
          </li>
        ))}
      </ul>

      {data.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1 || loading}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 
            disabled:cursor-not-allowed disabled:opacity-40">
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {data.page} of {data.pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.pages || loading}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 
            disabled:cursor-not-allowed disabled:opacity-40">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAllOrders;
