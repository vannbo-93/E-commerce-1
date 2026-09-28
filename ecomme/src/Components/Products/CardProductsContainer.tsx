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
  // "rating": الأعلى تقييمًا (Featured Products)، "newest": الأحدث (New Arrivals)
  sort?: "rating" | "newest";
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
  sort = "rating",
}: ProductCardContainerProps) => {
  const { getCardCartProps } = useCardCartActions();

  const [products, setProducts] = useState<RawProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    // الباك إند يرتّب ويقص: 4 منتجات فقط تُنقل عبر الشبكة، لا كل المتجر
    api
      .get(`/product?limit=${MAX_PRODUCTS}&sort=${sort}`)
      .then((res) => {
        if (!cancelled) setProducts(res.data.products ?? []);
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
