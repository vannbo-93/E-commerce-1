/** @format */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isAxiosError } from "axios";
import api from "../Api/baseURL";
import { useAuth } from "./AuthContext";

// نفس شكل رد الباك إند (cartService.ts → CartResponse)
export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  priceBeforeDiscount: number | null;
  image: string | null;
  brand: string | null;
  category: string | null;
}

export interface CartLine {
  _id: string;
  quantity: number;
  color: string | null;
  lineTotal: number;
  product: CartProduct;
}

export interface Cart {
  items: CartLine[];
  totalQuantity: number;
  totalPrice: number;
}

const EMPTY_CART: Cart = { items: [], totalQuantity: 0, totalPrice: 0 };

// يعيد حساب الإجماليات محليًا، يُستخدم فقط للتحديث المتفائل عند الحذف
// الأرقام النهائية تأتي دائمًا من رد الباك إند
const withTotals = (items: CartLine[]): Cart => ({
  items,
  totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: items.reduce((sum, i) => sum + i.lineTotal, 0),
});

// eslint-disable-next-line react-refresh/only-export-components
export const getCartErrorMessage = (err: unknown): string =>
  isAxiosError(err)
    ? (err.response?.data?.message ?? "Something went wrong")
    : "Something went wrong";

interface CartContextValue {
  cart: Cart;
  loading: boolean; // أثناء جلب السلة الأول بعد تسجيل الدخول
  error: string; // فشل جلب السلة
  addItem: (
    productId: string,
    color: string | null,
    quantity?: number,
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/cart");
      setCart(res.data.cart);
    } catch (err) {
      setError(getCartErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // السلة تتبع المستخدم: تُجلب عند الدخول وتُفرَّغ عند الخروج
  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- تفريغ السلة فور تسجيل الخروج
      setCart(EMPTY_CART);
      setError("");
      return;
    }
    void refresh();
  }, [authLoading, userId, refresh]);

  const addItem = async (
    productId: string,
    color: string | null,
    quantity = 1,
  ) => {
    const res = await api.post("/cart", {
      productId,
      quantity,
      ...(color ? { color } : {}),
    });
    setCart(res.data.cart);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const res = await api.patch(`/cart/items/${itemId}`, { quantity });
    setCart(res.data.cart);
  };

  // حذف متفائل: يختفي السطر فورًا، ويعود إن فشل الطلب
  const removeItem = async (itemId: string) => {
    const previous = cart;
    setCart(withTotals(cart.items.filter((i) => i._id !== itemId)));
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      setCart(res.data.cart);
    } catch (err) {
      setCart(previous);
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addItem,
        updateQuantity,
        removeItem,
        refresh,
      }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
