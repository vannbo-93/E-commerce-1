/** @format */
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import CartItem from "../../Components/Cart/CartItem";
import CartCheckout from "../../Components/Cart/CartCheckout";
import { useAuth } from "../../context/AuthContext";
import { getCartErrorMessage, useCart } from "../../context/CartContext";

// عدّلهما إن كانت المسارات مختلفة في الـ Router
const SHOP_PATH = "/products";
const LOGIN_PATH = "/login";

const CartPage = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    cart,
    loading,
    error: loadError,
    updateQuantity,
    removeItem,
    refresh,
  } = useCart();

  const [actionError, setActionError] = useState("");
  // الأسطر التي تنتظر رد السيرفر: state للعرض، و ref للحماية المتزامنة
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const pendingRef = useRef<Set<string>>(new Set());

  const setPending = (itemId: string, pending: boolean) => {
    if (pending) pendingRef.current.add(itemId);
    else pendingRef.current.delete(itemId);
    setPendingIds(new Set(pendingRef.current));
  };

  const runItemAction = async (itemId: string, action: () => Promise<void>) => {
    if (pendingRef.current.has(itemId)) return;
    setPending(itemId, true);
    setActionError("");
    try {
      await action();
    } catch (err) {
      setActionError(getCartErrorMessage(err));
    } finally {
      setPending(itemId, false);
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) =>
    runItemAction(itemId, () => updateQuantity(itemId, quantity));

  const handleDelete = (itemId: string) =>
    runItemAction(itemId, () => removeItem(itemId));

  const wrapper = "container mx-auto min-h-[680px] px-4 pb-10";

  if (authLoading || (loading && cart.items.length === 0)) {
    return (
      <div className={`${wrapper} py-10 text-center text-sm text-gray-500`}>
        Loading your cart...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`${wrapper} flex flex-col items-center gap-3 py-14 text-center`}>
        <p className="text-base font-semibold text-gray-900">
          Log in to see your cart
        </p>
        <Link
          to={LOGIN_PATH}
          state={{ from: "/cart" }}
          className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-medium text-white no-underline transition-colors hover:bg-sky-600">
          Log in
        </Link>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={`${wrapper} flex flex-col items-center gap-3 py-14 text-center`}>
        <p className="text-sm text-red-600">{loadError}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Try again
        </button>
      </div>
    );
  }

  const { items, totalQuantity, totalPrice } = cart;

  // منتج نفد أو قلّ مخزونه بعد إضافته للسلة: لا انتقال للدفع حتى يُصحَّح
  const stockProblems = items.filter(
    (i) => i.quantity > i.product.stock,
  ).length;
  const blockedReason =
    stockProblems > 0
      ? `${stockProblems === 1 ? "One item exceeds" : `${stockProblems} items exceed`} the available stock. Update your cart to continue.`
      : null;

  return (
    <div className={wrapper}>
      {/* حجم العنوان بـ style لأن CSS عامًا على h1 قد يتغلب على فئات Tailwind */}
      <div className="mb-5 mt-6 flex items-center gap-3">
        <h1 className="font-bold text-gray-900" style={{ fontSize: "1.75rem" }}>
          Shopping Cart
        </h1>
        {items.length > 0 ? (
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-600">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
        ) : null}
      </div>

      {actionError && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {actionError}
        </div>
      )}

      <div className="flex flex-col items-start gap-6 md:flex-row">
        <div className="w-full rounded-2xl bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] md:w-2/3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                <ShoppingCart size={28} />
              </div>
              <p className="text-base font-semibold text-gray-900">
                Your cart is empty
              </p>
              <p className="text-sm text-gray-500">
                Looks like you haven't added anything yet.
              </p>
              <Link
                to={SHOP_PATH}
                className="mt-2 rounded-lg bg-sky-500 px-6 py-3 text-sm font-medium text-white no-underline
                 transition-colors hover:bg-sky-600">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 px-4">
              {items.map((item) => (
                <CartItem
                  key={item._id}
                  image={item.product.image}
                  category={item.product.category}
                  title={item.product.name}
                  brand={item.product.brand}
                  color={item.color}
                  quantity={item.quantity}
                  price={item.product.price}
                  lineTotal={item.lineTotal}
                  stock={item.product.stock}
                  disabled={pendingIds.has(item._id)}
                  onQuantityChange={(q) =>
                    void handleQuantityChange(item._id, q)
                  }
                  onDelete={() => void handleDelete(item._id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:sticky md:top-24 md:w-1/3">
          <CartCheckout
            total={totalPrice}
            itemsCount={totalQuantity}
            busy={pendingIds.size > 0}
            blockedReason={blockedReason}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
