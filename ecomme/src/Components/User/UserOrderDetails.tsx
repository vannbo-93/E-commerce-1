/** @format */
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  IconArrowLeft,
  IconCircleCheck,
  IconMapPin,
  IconPhoto,
} from "@tabler/icons-react";
import api from "../../Api/baseURL";
import OrderStatusBadge from "./OrderStatusBadge";
import {
  PAYMENT_LABEL,
  PAYMENT_STATUS_LABEL,
  STATUS_LABEL,
  apiErrorMessage,
  formatDate,
  formatPrice,
  type OrderDetail,
  type OrderStatus,
} from "./orderUi";
import { optimizeImage } from "@/utils/cloudinary";

// مراحل الطلب الطبيعية بالترتيب (الإلغاء يُعرض منفصلًا)
const FLOW: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

const cardClass =
  "rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.08)]";

const StatusProgress = ({ order }: { order: OrderDetail }) => {
  if (order.status === "cancelled") {
    const cancelledAt = order.statusHistory.find(
      (h) => h.status === "cancelled",
    );
    return (
      <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
        This order was cancelled
        {cancelledAt ? ` on ${formatDate(cancelledAt.at, true)}` : ""}.
        {cancelledAt?.note ? ` ${cancelledAt.note}.` : ""}
      </div>
    );
  }

  const currentIndex = FLOW.indexOf(order.status);
  return (
    <ol className="flex items-start">
      {FLOW.map((status, i) => {
        const done = i <= currentIndex;
        const reachedAt = order.statusHistory.find(
          (h) => h.status === status,
        )?.at;
        return (
          <li
            key={status}
            className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div
                className={`h-0.5 flex-1 ${i === 0 ? "invisible" : done ? "bg-sky-500" : "bg-gray-200"}`}
              />
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                {i + 1}
              </div>
              <div
                className={`h-0.5 flex-1 ${
                  i === FLOW.length - 1
                    ? "invisible"
                    : i < currentIndex
                      ? "bg-sky-500"
                      : "bg-gray-200"
                }`}
              />
            </div>
            <span
              className={`mt-2 text-xs font-medium ${done ? "text-gray-900" : "text-gray-400"}`}>
              {STATUS_LABEL[status]}
            </span>
            {reachedAt && (
              <span className="text-[11px] text-gray-400">
                {formatDate(reachedAt)}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
};

const UserOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const justPlaced =
    (location.state as { justPlaced?: boolean } | null)?.justPlaced === true;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const cancellingRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    api
      .get(`/order/my/${id}`)
      .then((res) => {
        if (!cancelled) setOrder(res.data.order);
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleCancel = async () => {
    if (!order || cancellingRef.current) return;
    const ok = window.confirm(
      `Cancel order #${order.orderNumber}? This can't be undone.`,
    );
    if (!ok) return;

    cancellingRef.current = true;
    setCancelling(true);
    setCancelError("");
    try {
      const res = await api.patch(`/order/my/${order._id}/cancel`);
      setOrder(res.data.order);
    } catch (err) {
      setCancelError(apiErrorMessage(err));
    } finally {
      cancellingRef.current = false;
      setCancelling(false);
    }
  };

  const backLink = (
    <Link
      to="/user/allorders"
      className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 no-underline hover:text-sky-600">
      <IconArrowLeft size={16} />
      My Orders
    </Link>
  );

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        {backLink}
        <p className="py-10 text-center text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col gap-4">
        {backLink}
        <p className="py-10 text-center text-sm text-gray-500">
          Loading order...
        </p>
      </div>
    );
  }

  const { shippingAddress: addr } = order;

  return (
    <div className="flex flex-col gap-5">
      {backLink}

      {justPlaced && (
        <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-4 text-green-800">
          <IconCircleCheck size={24} className="shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">
              Thank you! Your order has been placed.
            </p>
            <p className="mt-0.5">
              We'll confirm it shortly. You'll pay {formatPrice(order.total)} in
              cash when it arrives.
            </p>
          </div>
        </div>
      )}

      {/* العنوان والحالة */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500">
            Placed on {formatDate(order.createdAt, true)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <section className={cardClass}>
        <StatusProgress order={order} />
      </section>

      {/* المنتجات */}
      <section className={cardClass}>
        <h2 className="mb-3 font-semibold text-gray-900">Items</h2>
        <ul className="flex flex-col divide-y divide-gray-100">
          {order.items.map((item) => (
            <li key={item._id} className="flex items-center gap-3 py-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {item.image ? (
                  <img
                    src={optimizeImage(item.image, 160)}
                    alt={item.name}
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <IconPhoto size={22} className="text-gray-300" />
                )}
              </div>
              <div className="min-w-0 flex-1 text-sm">
                {/* الرابط للمنتج الحالي؛ الاسم والسعر هنا لقطة من وقت الطلب */}
                <Link
                  to={`/products/${item.product}`}
                  className="font-medium text-gray-900 no-underline hover:text-sky-600">
                  {item.name}
                </Link>
                <div className="mt-0.5 flex items-center gap-2 text-gray-500">
                  {formatPrice(item.price)} × {item.quantity}
                  {item.color && (
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-gray-200"
                      style={{ backgroundColor: item.color }}
                      title={item.color}
                    />
                  )}
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatPrice(item.lineTotal)}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* عنوان الشحن */}
        <section className={cardClass}>
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
            <IconMapPin size={18} className="text-gray-400" />
            Shipping address
          </h2>
          <div className="flex flex-col gap-0.5 text-sm text-gray-700">
            <span className="font-medium text-gray-900">{addr.fullName}</span>
            <span>{addr.street}</span>
            <span>
              {addr.city}
              {addr.postalCode ? ` ${addr.postalCode}` : ""}
            </span>
            <span className="text-gray-500">{addr.phone}</span>
          </div>
        </section>

        {/* الدفع والمجموع */}
        <section className={cardClass}>
          <h2 className="mb-3 font-semibold text-gray-900">Payment</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Method</span>
              <span>{PAYMENT_LABEL[order.paymentMethod]}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Status</span>
              <span>{PAYMENT_STATUS_LABEL[order.paymentStatus]}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-gray-600">
              <span>Items</span>
              <span>{formatPrice(order.itemsTotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {order.shippingFee === 0
                  ? "Free"
                  : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* الإلغاء: فقط ما لم يؤكده المتجر بعد */}
      {order.canCancel && (
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            onClick={() => void handleCancel()}
            disabled={cancelling}
            className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 
            transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
            {cancelling ? "Cancelling..." : "Cancel order"}
          </button>
          <p className="text-xs text-gray-500">
            You can cancel until we confirm your order.
          </p>
          {cancelError && (
            <p role="alert" className="text-sm text-red-600">
              {cancelError}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserOrderDetails;
