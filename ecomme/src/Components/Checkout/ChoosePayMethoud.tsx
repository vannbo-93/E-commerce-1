/** @format */
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Banknote, Check, CreditCard, ImageOff, MapPin } from "lucide-react";
import api from "../../Api/baseURL";
import { useCart } from "../../context/CartContext";
import {
  apiErrorMessage,
  formatPrice,
  type OrderDetail,
} from "../User/orderUi";

interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
}

type PaymentMethod = "cod";

// "Pay by card" معروض معطّلًا: لا بوابة دفع مربوطة بعد، فاختياره كان سيعرض نجاحًا وهميًا
const paymentOptions: {
  id: PaymentMethod | "card";
  label: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}[] = [
  {
    id: "cod",
    label: "Cash on delivery",
    description: "Pay in cash when your order arrives at your door",
    icon: <Banknote size={22} />,
    available: true,
  },
  {
    id: "card",
    label: "Pay by card",
    description: "Coming soon",
    icon: <CreditCard size={22} />,
    available: false,
  },
];

const cardClass =
  "rounded-2xl bg-white p-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] md:p-6";

const SectionTitle = ({ step, title }: { step: number; title: string }) => (
  <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
      {step}
    </span>
    {title}
  </h2>
);

const ChoosePayMethoud = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, refresh: refreshCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");
  // حماية متزامنة من الضغط المزدوج (والباك إند يحمي أيضًا بحجز السلة ذريًا)
  const placingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/address")
      .then((res) => {
        if (cancelled) return;
        const list: Address[] = res.data.addresses ?? [];
        setAddresses(list);
        // العنوان الافتراضي مختار مسبقًا
        setSelectedAddressId(
          (list.find((a) => a.isDefault) ?? list[0])?._id ?? null,
        );
      })
      .catch(() => {
        if (!cancelled) setAddressesError("Failed to load your addresses.");
      })
      .finally(() => {
        if (!cancelled) setAddressesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || placingRef.current) return;

    placingRef.current = true;
    setPlacing(true);
    setPlaceError("");

    try {
      // لا مبلغ يُرسل: الباك إند يحسب الأسعار والمجموع بنفسه
      const res = await api.post("/order", {
        addressId: selectedAddressId,
        paymentMethod,
      });
      const order: OrderDetail = res.data.order;
      // الباك إند فرّغ السلة: نحدّث العداد في الـ NavBar
      await refreshCart();
      navigate(`/user/orders/${order._id}`, {
        replace: true,
        state: { justPlaced: true },
      });
    } catch (err) {
      setPlaceError(apiErrorMessage(err));
      // نفاد مخزون مثلًا: الباك إند أعاد السلة كما كانت، فنعرضها محدّثة
      await refreshCart();
    } finally {
      placingRef.current = false;
      setPlacing(false);
    }
  };

  // ===== الحالات الخاصة =====

  if (cartLoading && cart.items.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-gray-500">
        Loading your cart...
      </p>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-16 text-center">
        <p className="text-base font-semibold text-gray-900">
          Your cart is empty
        </p>
        <p className="text-sm text-gray-500">
          Add some products before checking out.
        </p>
        <Link
          to="/products"
          className="mt-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-medium text-white no-underline hover:bg-sky-600">
          Browse products
        </Link>
      </div>
    );
  }

  const canPlace = selectedAddressId !== null && !placing;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <h1
        className="mb-6 mt-6 font-bold text-gray-900"
        style={{ fontSize: "1.75rem" }}>
        Checkout
      </h1>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        {/* ===== العمود الأيسر: العنوان والدفع ===== */}
        <div className="flex w-full flex-col gap-6 lg:w-3/5">
          {/* 1. عنوان الشحن */}
          <section className={cardClass}>
            <SectionTitle step={1} title="Shipping address" />

            {addressesLoading ? (
              <p className="text-sm text-gray-500">Loading addresses...</p>
            ) : addressesError ? (
              <p className="text-sm text-red-600">{addressesError}</p>
            ) : addresses.length === 0 ? (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-gray-600">
                  You don't have a saved address yet.
                </p>
                <Link
                  to="/user/add-address"
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-white 
                  no-underline hover:bg-sky-600">
                  <MapPin size={16} />
                  Add an address
                </Link>
              </div>
            ) : (
              <fieldset>
                <legend className="sr-only">Shipping address</legend>
                <div className="flex flex-col gap-3">
                  {addresses.map((address) => {
                    const isSelected = selectedAddressId === address._id;
                    return (
                      <label
                        key={address._id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors 
                          has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-300 ${
                          isSelected
                            ? "border-sky-500 bg-sky-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}>
                        <input
                          type="radio"
                          name="shippingAddress"
                          value={address._id}
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(address._id)}
                          className="sr-only"
                        />
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-sky-500 bg-sky-500"
                              : "border-gray-300"
                          }`}>
                          {isSelected && (
                            <Check size={12} className="text-white" />
                          )}
                        </span>
                        <span className="flex flex-col gap-0.5 text-sm">
                          <span className="flex items-center gap-2 font-semibold text-gray-900">
                            {address.label}
                            {address.isDefault && (
                              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                                Default
                              </span>
                            )}
                          </span>
                          <span className="text-gray-700">
                            {address.fullName}
                          </span>
                          <span className="text-gray-600">
                            {address.street}, {address.city}
                            {address.postalCode ? ` ${address.postalCode}` : ""}
                          </span>
                          <span className="text-gray-500">{address.phone}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                <Link
                  to="/user/add-address"
                  className="mt-3 inline-block text-sm font-medium text-sky-600">
                  + Add a new address
                </Link>
              </fieldset>
            )}
          </section>

          {/* 2. طريقة الدفع */}
          <section className={cardClass}>
            <SectionTitle step={2} title="Payment method" />
            <fieldset>
              <legend className="sr-only">Payment method</legend>
              <div className="flex flex-col gap-3">
                {paymentOptions.map((option) => {
                  const isSelected =
                    option.available && paymentMethod === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-colors has-[:focus-visible]:ring-2 
                        has-[:focus-visible]:ring-sky-300 ${
                        !option.available
                          ? "cursor-not-allowed border-gray-100 opacity-50"
                          : isSelected
                            ? "cursor-pointer border-sky-500 bg-sky-50"
                            : "cursor-pointer border-gray-200 hover:border-gray-300"
                      }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.id}
                        checked={isSelected}
                        disabled={!option.available}
                        onChange={() => {
                          if (option.id === "cod") setPaymentMethod("cod");
                        }}
                        className="sr-only"
                      />
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                          isSelected
                            ? "bg-sky-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {option.label}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          {option.description}
                        </div>
                      </div>
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          isSelected
                            ? "border-sky-500 bg-sky-500"
                            : "border-gray-300"
                        }`}>
                        {isSelected && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </section>
        </div>

        {/* ===== العمود الأيمن: ملخص الطلب ===== */}
        <aside className={`${cardClass} w-full lg:sticky lg:top-24 lg:w-2/5`}>
          <SectionTitle step={3} title="Order summary" />

          <ul className="flex flex-col divide-y divide-gray-100">
            {cart.items.map((item) => (
              <li key={item._id} className="flex items-center gap-3 py-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <ImageOff size={20} className="text-gray-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <div className="truncate font-medium text-gray-900">
                    {item.product.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    Qty {item.quantity}
                    {item.color && (
                      <span
                        className="h-3 w-3 rounded-full border border-gray-200"
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

          <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items ({cart.totalQuantity})</span>
              <span>{formatPrice(cart.totalPrice)}</span>
            </div>
            {/* يطابق SHIPPING_FEE = 0 في الباك إند؛ حدّثه حين تتغير سياسة الشحن */}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(cart.totalPrice)}</span>
            </div>
          </div>

          {placeError && (
            <div
              role="alert"
              className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {placeError}{" "}
              <Link to="/cart" className="font-medium underline">
                Review your cart
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => void handlePlaceOrder()}
            disabled={!canPlace}
            className="mt-5 w-full rounded-lg bg-sky-500 py-3 text-sm font-semibold text-white transition-colors 
            hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500">
            {placing ? "Placing order..." : "Place order"}
          </button>
          {!selectedAddressId && !addressesLoading && (
            <p className="mt-2 text-center text-xs text-gray-500">
              Add a shipping address to continue.
            </p>
          )}
          <p className="mt-3 text-center text-xs text-gray-400">
            You'll pay {formatPrice(cart.totalPrice)} in cash when your order
            arrives.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default ChoosePayMethoud;
