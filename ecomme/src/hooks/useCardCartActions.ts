/** @format */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CardCartStatus } from "../Components/Products/ProductCard";
import { useAuth } from "../context/AuthContext";
import { getCartErrorMessage, useCart } from "../context/CartContext";

// عدّله إن كان مسار صفحة الدخول مختلفًا في الـ Router
const LOGIN_PATH = "/login";
const ADDED_RESET_MS = 2000;

interface CardState {
  status: CardCartStatus;
  error?: string;
}

// منطق زر "Add to Cart" في بطاقات المنتجات، مشترك بين كل الأقسام التي تعرض بطاقات:
// تحويل الزائر للدخول، منع الضغط المزدوج، حالة "Added" المؤقتة، ورسالة الخطأ
export const useCardCartActions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { addItem } = useCart();

  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const pendingRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<number[]>([]);

  // إلغاء مؤقتات "Added" عند مغادرة الصفحة
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const setCardState = (id: string, next: CardState) =>
    setCardStates((prev) => ({ ...prev, [id]: next }));

  const handleAddToCart = async (productId: string) => {
    if (authLoading || pendingRef.current.has(productId)) return;

    if (!user) {
      navigate(LOGIN_PATH, { state: { from: location.pathname } });
      return;
    }

    pendingRef.current.add(productId);
    setCardState(productId, { status: "adding" });

    try {
      await addItem(productId, null);
      setCardState(productId, { status: "added" });
      const timer = window.setTimeout(
        () => setCardState(productId, { status: "idle" }),
        ADDED_RESET_MS,
      );
      timersRef.current.push(timer);
    } catch (err) {
      setCardState(productId, {
        status: "error",
        error: getCartErrorMessage(err),
      });
    } finally {
      pendingRef.current.delete(productId);
    }
  };

  // الخصائص الجاهزة لتمريرها إلى ProductCard مباشرة
  const getCardCartProps = (productId: string) => {
    const card = cardStates[productId];
    return {
      onAddToCart: (id: string) => void handleAddToCart(id),
      cartStatus: card?.status ?? ("idle" as CardCartStatus),
      ...(card?.error ? { cartError: card.error } : {}),
    };
  };

  return { getCardCartProps };
};
