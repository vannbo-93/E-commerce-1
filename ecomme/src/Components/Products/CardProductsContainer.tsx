/** @format */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard, { type CardCartStatus } from "./ProductCard";
import SubTitle from "../Utility/SubTitle";
import api from "../../Api/baseURL";
import { useAuth } from "../../context/AuthContext";
import { getCartErrorMessage, useCart } from "../../context/CartContext";

// عدّله إن كان مسار صفحة الدخول مختلفًا في الـ Router
const LOGIN_PATH = "/login";
const MAX_PRODUCTS = 4;
const ADDED_RESET_MS = 2000;

export interface ProductCardContainerProps {
  title?: string;
  btntitle?: string;
  pathText?: string;
  // "newest": الأحدث أولًا (لقسم New Arrivals)، "default": بترتيب الباك إند
  sort?: "default" | "newest";
}

interface RawProduct {
  _id: string;
  name: string;
  price: number;
  priceBeforeDiscount?: number;
  images: string[];
  colors: string[];
  rating?: { value: number; count: number };
}

interface CardState {
  status: CardCartStatus;
  error?: string;
}

const CardProductsContainer = ({
  title,
  btntitle,
  pathText,
  sort = "default",
}: ProductCardContainerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { addItem } = useCart();

  const [products, setProducts] = useState<RawProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});

  // حماية متزامنة من الضغط المزدوج، ومؤقتات "Added" لإلغائها عند مغادرة الصفحة
  const pendingRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/product")
      .then((res) => {
        if (!cancelled) {
          // الباك إند يعيد كل المنتجات حاليًا؛ نرتّب محليًا ونعرض أول 4 فقط
          const all: RawProduct[] = res.data.products ?? [];
          const ordered =
            sort === "newest"
              ? // ObjectId يبدأ بوقت الإنشاء بطول ثابت، فمقارنته كنص = مقارنة بالزمن
                [...all].sort((a, b) => b._id.localeCompare(a._id))
              : all;
          setProducts(ordered.slice(0, MAX_PRODUCTS));
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("Failed to load products.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const timers = timersRef.current;
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [sort]);

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

  // لا نعرض القسم كاملًا أثناء التحميل أو إن لم توجد منتجات
  if (loading || (!loadError && products.length === 0)) return null;

  return (
    <div className="w-full">
      {title ? (
        <SubTitle title={title} btnTitle={btntitle} pathText={pathText} />
      ) : null}

      {loadError ? (
        <p className="py-6 text-center text-sm text-red-600">{loadError}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {products.map((product) => {
            const card = cardStates[product._id];
            return (
              <div key={product._id} className="min-w-0">
                <ProductCard
                  id={product._id}
                  title={product.name}
                  image={product.images[0] ?? null}
                  ratingValue={product.rating?.value ?? 0}
                  ratingCount={product.rating?.count ?? 0}
                  price={product.price}
                  {...(product.priceBeforeDiscount !== undefined
                    ? { oldPrice: product.priceBeforeDiscount }
                    : {})}
                  hasOptions={product.colors.length > 0}
                  onAddToCart={(id) => void handleAddToCart(id)}
                  cartStatus={card?.status ?? "idle"}
                  {...(card?.error ? { cartError: card.error } : {})}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CardProductsContainer;
