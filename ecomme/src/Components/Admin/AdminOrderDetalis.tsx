/** @format */
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  IconArrowLeft,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPhoto,
} from "@tabler/icons-react";
import { isAxiosError } from "axios";
import api from "../../Api/baseURL";
import OrderStatusBadge from "../User/OrderStatusBadge";
import {
  PAYMENT_LABEL,
  PAYMENT_STATUS_LABEL,
  STATUS_LABEL,
  apiErrorMessage,
  formatDate,
  formatPrice,
  type OrderDetail,
  type OrderStatus,
} from "../User/orderUi";
import { optimizeImage } from "@/utils/cloudinary";

// نص كل زر حسب الحالة التي ينقل إليها الطلب
const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  confirmed: "Confirm order",
  shipped: "Mark as shipped",
  delivered: "Mark as delivered",
  cancelled: "Cancel order",
};

const cardClass =
  "rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.08)]";

const AdminOrderDetalis = () => {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loadError, setLoadError] = useState("");
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState<OrderStatus | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const updatingRef = useRef(false);

  const loadOrder = async (orderId: string) => {
    const res = await api.get(`/order/admin/${orderId}`);
    return res.data.order as OrderDetail;
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    loadOrder(id)
      .then((o) => {
        if (!cancelled) setOrder(o);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(apiErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleTransition = async (target: OrderStatus) => {
    if (!order || updatingRef.current) return;

    if (target === "cancelled") {
      const ok = window.confirm(
        `Cancel order #${order.orderNumber}? The items will be returned to stock. This can't be undone.`,
      );
      if (!ok) return;
    }

    updatingRef.current = true;
    setUpdating(target);
    setActionError("");
    setActionSuccess("");

    try {
      const res = await api.patch(`/order/admin/${order._id}/status`, {
        status: target,
        note,
      });
      setOrder(res.data.order);
      setNote("");
      setActionSuccess(
        `Order marked as ${STATUS_LABEL[target].toLowerCase()}.`,
      );
    } catch (err) {
      setActionError(apiErrorMessage(err));
      // 409: أدمن آخر غيّر الحالة في نفس اللحظة. نعيد القراءة لنعرض الحالة الفعلية
      if (isAxiosError(err) && err.response?.status === 409) {
        try {
          setOrder(await loadOrder(order._id));
        } catch {
          // يبقى الخطأ الأصلي معروضًا
        }
      }
    } finally {
      updatingRef.current = false;
      setUpdating(null);
    }
  };

  const backLink = (
    <Link
      to="/admin/allorders"
      className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 no-underline hover:text-sky-600">
      <IconArrowLeft size={16} />
      All orders
    </Link>
  );

  if (loadError) {
    return (
      <div className="flex flex-col gap-4 py-3">
        {backLink}
        <p className="py-10 text-center text-sm text-red-600">{loadError}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col gap-4 py-3">
        {backLink}
        <p className="py-10 text-center text-sm text-gray-500">
          Loading order...
        </p>
      </div>
    );
  }

  const { shippingAddress: addr, customer } = order;
  const transitions = order.allowedTransitions;
  // الأزرار العادية أولًا، والإلغاء في الآخر بلون مختلف
  const forward = transitions.filter((t) => t !== "cancelled");
  const canCancel = transitions.includes("cancelled");

  return (
    <div className="flex flex-col gap-5 py-3">
      {backLink}

      {/* العنوان */}
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

      {/* الإجراءات */}
      <section className={cardClass}>
        <h2 className="mb-3 font-semibold text-gray-900">Update status</h2>

        {transitions.length === 0 ? (
          <p className="text-sm text-gray-500">
            This order is {STATUS_LABEL[order.status].toLowerCase()}. No further
            changes are possible.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="status-note"
                className="text-sm font-medium text-gray-700">
                Note{" "}
                <span className="font-normal text-gray-400">
                  (optional, saved in the order history)
                </span>
              </label>
              <textarea
                id="status-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={300}
                rows={2}
                placeholder="e.g. Shipped with Amana, tracking 123456"
                disabled={updating !== null}
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 
                placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 
                disabled:opacity-60"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {forward.map((target) => (
                <button
                  key={target}
                  type="button"
                  onClick={() => void handleTransition(target)}
                  disabled={updating !== null}
                  className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors 
                  hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500">
                  {updating === target ? "Updating..." : ACTION_LABEL[target]}
                </button>
              ))}
              {canCancel && (
                <button
                  type="button"
                  onClick={() => void handleTransition("cancelled")}
                  disabled={updating !== null}
                  className="ml-auto rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 
                  transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                  {updating === "cancelled"
                    ? "Cancelling..."
                    : ACTION_LABEL.cancelled}
                </button>
              )}
            </div>
          </div>
        )}

        {actionError && (
          <p
            role="alert"
            className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {actionError}
          </p>
        )}
        {actionSuccess && (
          <p role="status" className="mt-3 text-sm text-green-600">
            {actionSuccess}
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* المنتجات */}
        <section className={`${cardClass} lg:col-span-2`}>
          <h2 className="mb-3 font-semibold text-gray-900">
            Items ({order.itemsCount})
          </h2>
          <ul className="flex flex-col divide-y divide-gray-100">
            {order.items.map((item) => (
              <li key={item._id} className="flex items-center gap-3 py-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  {item.image ? (
                    <img
                      src={optimizeImage(item.image, 160)}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <IconPhoto size={20} className="text-gray-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-gray-500">
                    {formatPrice(item.price)} × {item.quantity}
                    {item.color && (
                      <span className="inline-flex items-center gap-1">
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-gray-200"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs">{item.color}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.lineTotal)}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-col gap-1.5 border-t border-gray-100 pt-3 text-sm">
            <div className="flex justify-between text-gray-600">
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

        {/* العميل والشحن والدفع */}
        <div className="flex flex-col gap-5">
          <section className={cardClass}>
            <h2 className="mb-3 font-semibold text-gray-900">Customer</h2>
            {customer ? (
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-900">
                  {customer.username}
                </span>
                <a
                  href={`mailto:${customer.email}`}
                  className="inline-flex items-center gap-1.5 text-sky-600 no-underline hover:underline">
                  <IconMail size={14} />
                  {customer.email}
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                This account has been deleted.
              </p>
            )}
          </section>

          <section className={cardClass}>
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
              <IconMapPin size={18} className="text-gray-400" />
              Ship to
            </h2>
            <div className="flex flex-col gap-0.5 text-sm text-gray-700">
              <span className="font-medium text-gray-900">{addr.fullName}</span>
              <span>{addr.street}</span>
              <span>
                {addr.city}
                {addr.postalCode ? ` ${addr.postalCode}` : ""}
              </span>
              <a
                href={`tel:${addr.phone}`}
                className="mt-1 inline-flex items-center gap-1.5 text-sky-600 no-underline hover:underline">
                <IconPhone size={14} />
                {addr.phone}
              </a>
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="mb-3 font-semibold text-gray-900">Payment</h2>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Method</span>
                <span>{PAYMENT_LABEL[order.paymentMethod]}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Status</span>
                <span
                  className={
                    order.paymentStatus === "paid"
                      ? "font-medium text-green-600"
                      : ""
                  }>
                  {PAYMENT_STATUS_LABEL[order.paymentStatus]}
                </span>
              </div>
              {order.paymentMethod === "cod" &&
                order.paymentStatus === "unpaid" && (
                  <p className="mt-1 text-xs text-gray-400">
                    Marked as paid automatically when the order is delivered.
                  </p>
                )}
            </div>
          </section>
        </div>
      </div>

      {/* السجل */}
      <section className={cardClass}>
        <h2 className="mb-3 font-semibold text-gray-900">History</h2>
        <ol className="flex flex-col gap-3">
          {[...order.statusHistory].reverse().map((h, i) => (
            <li key={`${h.status}-${h.at}-${i}`} className="flex gap-3 text-sm">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  i === 0 ? "bg-sky-500" : "bg-gray-300"
                }`}
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {STATUS_LABEL[h.status]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(h.at, true)}
                  </span>
                </div>
                {h.note && <p className="mt-0.5 text-gray-600">{h.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default AdminOrderDetalis;
