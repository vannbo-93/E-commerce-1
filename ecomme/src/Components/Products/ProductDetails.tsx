/** @format */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductGallery from "./ProductGallery";
import ProductsText, { type CartFeedback } from "./ProductText";
import RateContainer from "../Rate/RateContainer";
import api from "../../Api/baseURL";
import { useAuth } from "../../context/AuthContext";
import { getCartErrorMessage, useCart } from "../../context/CartContext";

// عدّله إن كان مسار صفحة الدخول مختلفًا في الـ Router
const LOGIN_PATH = "/login";

interface RawProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  priceBeforeDiscount?: number;
  colors: string[];
  images: string[];
  rating: { value: number; count: number };
  stock?: number;
  category: { _id: string; name: string } | null;
  brand: { _id: string; name: string } | null;
}

// حالة واحدة مدمجة بدل ثلاث حالات منفصلة (loading/error/product)، بحيث كل مرحلة
// تُحدَّث بعملية setState واحدة فقط، لا عدة عمليات متتالية قد تُحدث رسمًا متسلسلًا
type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; product: RawProduct };

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { addItem } = useCart();

  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [adding, setAdding] = useState(false);
  const [cartFeedback, setCartFeedback] = useState<CartFeedback | null>(null);
  // حماية متزامنة من الضغط المزدوج قبل أن يتحدّث الـ state
  const addingRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- إعادة ضبط الحالة عند تغيّر id
    setState({ status: "loading" });
    setCartFeedback(null);

    api
      .get(`/product/${id}`)
      .then((res) => {
        if (!cancelled) {
          setState({ status: "success", product: res.data.product });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Failed to load this product.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = async (color: string | null) => {
    if (state.status !== "success" || addingRef.current || authLoading) return;

    // زائر: إلى صفحة الدخول، مع حفظ صفحة المنتج للعودة إليها
    if (!user) {
      navigate(LOGIN_PATH, { state: { from: location.pathname } });
      return;
    }

    addingRef.current = true;
    setAdding(true);
    setCartFeedback(null);

    try {
      await addItem(state.product._id, color);
      setCartFeedback({ kind: "success", text: "Added to your cart." });
    } catch (err) {
      setCartFeedback({ kind: "error", text: getCartErrorMessage(err) });
    } finally {
      addingRef.current = false;
      setAdding(false);
    }
  };

  if (state.status === "loading") {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-sm text-gray-500">
        Loading product...
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-sm text-red-600">
        {state.message}
      </div>
    );
  }

  const product = state.product;

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col gap-4 py-3 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <ProductGallery images={product.images} title={product.name} />
        </div>
        <div className="w-full lg:w-2/3">
          <ProductsText
            // key: يعيد ضبط اللون المختار عند الانتقال لمنتج آخر
            key={product._id}
            category={product.category?.name ?? "Uncategorized"}
            title={product.name}
            rating={product.rating?.value ?? 0}
            ratingCount={product.rating?.count ?? 0}
            brand={product.brand?.name ?? "Unknown"}
            colors={product.colors}
            description={product.description}
            price={product.price}
            // spread شرطي بسبب exactOptionalPropertyTypes في tsconfig
            {...(product.priceBeforeDiscount !== undefined
              ? { priceBeforeDiscount: product.priceBeforeDiscount }
              : {})}
            stock={product.stock ?? 0}
            onAddToCart={handleAddToCart}
            isAdding={adding || authLoading}
            cartFeedback={cartFeedback}
          />
        </div>
      </div>
      <RateContainer productId={product._id} />
    </div>
  );
};

export default ProductDetails;
