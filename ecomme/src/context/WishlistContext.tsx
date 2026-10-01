/** @format */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import api from "../Api/baseURL";
import { useAuth } from "./AuthContext";

// نفس شكل رد الباك إند (wishlistService.ts → WishlistProductResponse)
export interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  priceBeforeDiscount: number | null;
  image: string | null;
  hasOptions: boolean;
  rating: { value: number; count: number };
  stock: number;
}

interface WishlistContextValue {
  ids: Set<string>; // للقلوب والعداد: هل المنتج في المفضلة؟
  products: WishlistProduct[]; // لصفحة المفضلة
  loading: boolean;
  error: string;
  isInWishlist: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [ids, setIds] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // المنتجات التي تنتظر رد السيرفر: تمنع ضغطتين متتاليتين على نفس القلب
  const pendingRef = useRef<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/wishlist");
      const list: WishlistProduct[] = res.data.products ?? [];
      setProducts(list);
      setIds(new Set(list.map((p) => p._id)));
    } catch {
      setError("Failed to load your wishlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  // المفضلة تتبع المستخدم: تُجلب عند الدخول وتُفرَّغ عند الخروج
  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- تفريغ المفضلة فور تسجيل الخروج
      setIds(new Set());
      setProducts([]);
      setError("");
      return;
    }
    void refresh();
  }, [authLoading, userId, refresh]);

  const isInWishlist = (productId: string) => ids.has(productId);

  // تحديث متفائل: القلب يتلون فورًا، ويعود لحالته إن فشل الطلب
  const toggle = async (productId: string) => {
    if (pendingRef.current.has(productId)) return;
    pendingRef.current.add(productId);

    const wasIn = ids.has(productId);
    const flip = (set: Set<string>, add: boolean) => {
      const next = new Set(set);
      if (add) next.add(productId);
      else next.delete(productId);
      return next;
    };

    setIds((prev) => flip(prev, !wasIn));

    try {
      const res = wasIn
        ? await api.delete(`/wishlist/${productId}`)
        : await api.post(`/wishlist/${productId}`);
      setIds(new Set<string>(res.data.productIds ?? []));
      if (wasIn) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (err) {
      setIds((prev) => flip(prev, wasIn));
      throw err;
    } finally {
      pendingRef.current.delete(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ ids, products, loading, error, isInWishlist, toggle, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
};
