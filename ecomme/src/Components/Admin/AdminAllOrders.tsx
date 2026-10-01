/** @format */
import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  IconChevronRight,
  IconPackage,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import api from "../../Api/baseURL";
import PaginationComponent from "../Utility/Pagination";
import OrderStatusBadge from "../User/OrderStatusBadge";
import {
  STATUS_LABEL,
  apiErrorMessage,
  formatDate,
  formatPrice,
  type OrderStatus,
  type OrderSummary,
} from "../User/orderUi";

const PAGE_SIZE = 20;

const STATUS_TABS: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

interface AdminOrderRow extends OrderSummary {
  customer: { _id: string; username: string; email: string } | null;
  city: string;
}

interface AdminOrdersResponse {
  orders: AdminOrderRow[];
  total: number;
  page: number;
  pages: number;
  counts: Record<OrderStatus, number>;
}

const AdminAllOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // الفلاتر في الرابط: زر الرجوع يعمل، وتحديث الصفحة يُبقيها
  const status = searchParams.get("status") ?? "";
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [data, setData] = useState<AdminOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- إظهار التحميل عند تغيّر الفلاتر
    setLoading(true);
    setError("");

    const q = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    });
    if (status) q.set("status", status);
    if (search) q.set("search", search);

    api
      .get(`/order/admin?${q.toString()}`)
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
  }, [status, search, page]);

  // أي تغيير في الفلاتر يعيد الترقيم للصفحة الأولى
  const updateParams = (changes: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(changes)) {
        if (value === "") next.delete(key);
        else next.set(key, value);
      }
      if (!("page" in changes)) next.delete("page");
      return next;
    });
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput.replace(/^#/, "").trim() });
  };

  const clearSearch = () => {
    setSearchInput("");
    updateParams({ search: "" });
  };

  const handlePageChange = (p: number) => {
    updateParams({ page: p <= 1 ? "" : String(p) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const counts = data?.counts;
  const allCount = counts
    ? Object.values(counts).reduce((sum, n) => sum + n, 0)
    : null;

  const tabClass = (active: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "bg-sky-500 text-white"
        : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
    }`;

  return (
    <div className="flex flex-col gap-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">Orders</h2>

        <form
          onSubmit={handleSearch}
          role="search"
          className="relative w-full sm:w-64">
          <IconSearch
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Order number, e.g. 1024"
            aria-label="Search by order number"
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <IconX size={14} />
            </button>
          )}
        </form>
      </div>

      {/* تبويبات الحالة: الأعداد من الباك إند، لكل الطلبات لا للصفحة الحالية فقط */}
      <nav
        aria-label="Filter by status"
        className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => updateParams({ status: "" })}
          aria-pressed={status === ""}
          className={tabClass(status === "")}>
          All{allCount !== null ? ` (${allCount})` : ""}
        </button>
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => updateParams({ status: s })}
            aria-pressed={status === s}
            className={tabClass(status === s)}>
            {STATUS_LABEL[s]}
            {counts ? ` (${counts[s]})` : ""}
          </button>
        ))}
      </nav>

      {error ? (
        <p className="py-10 text-center text-sm text-red-600">{error}</p>
      ) : !data ? (
        <p className="py-10 text-center text-sm text-gray-500">
          Loading orders...
        </p>
      ) : data.orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-14 text-center shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <IconPackage size={26} />
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {search
              ? `No order #${search}`
              : status
                ? `No ${STATUS_LABEL[status as OrderStatus].toLowerCase()} orders`
                : "No orders yet"}
          </p>
        </div>
      ) : (
        <div
          className={`overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] transition-opacity ${
            loading ? "opacity-50" : ""
          }`}
          aria-busy={loading}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 text-right font-medium">Items</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" aria-label="Open" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-gray-900 no-underline hover:text-sky-600">
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {order.customer ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {order.customer.username}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.customer.email}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Deleted account</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(order.createdAt, true)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.city}</td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {order.itemsCount}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        aria-label={`Open order #${order.orderNumber}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-sky-50 hover:text-sky-600">
                        <IconChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data && data.pages > 1 && (
        <PaginationComponent
          count={data.pages}
          page={Math.min(page, data.pages)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AdminAllOrders;
