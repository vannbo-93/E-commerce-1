/** @format */
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SubTitle from "../Utility/SubTitle";
import api from "../../Api/baseURL";
import { useCardCartActions } from "../../hooks/useCardCartActions";

const MAX_PRODUCTS = 4;

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

const CardProductsContainer = ({
  title,
  btntitle,
  pathText,
  sort = "default",
}: ProductCardContainerProps) => {
  const { getCardCartProps } = useCardCartActions();

  const [products, setProducts] = useState<RawProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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

    return () => {
      cancelled = true;
    };
  }, [sort]);

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
          {products.map((product) => (
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
                {...getCardCartProps(product._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardProductsContainer;
