/** @format */
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IconMoodEmpty } from "@tabler/icons-react";
import CategoryHeader from "../../Page/Category/CategoryHeader";
import SearchCountResult from "../../Components/Utility/SearchCountResult";
import SideFilter from "../../Components/Utility/SideFilter";
import PaginationComponent from "../Utility/Pagination";
import ProductCard from "./ProductCard";
import api from "../../Api/baseURL";
import { useCardCartActions } from "../../hooks/useCardCartActions";

const PAGE_SIZE = 12;

// المعاملات التي تُمرَّر من رابط الصفحة إلى GET /product كما هي
const FORWARDED_PARAMS = [
  "search",
  "category",
  "brand",
  "minPrice",
  "maxPrice",
  "sort",
  "page",
] as const;

interface RawProduct {
  _id: string;
  name: string;
  price: number;
  priceBeforeDiscount?: number;
  images: string[];
  colors: string[];
  rating?: { value: number; count: number };
}

interface ListState {
  products: RawProduct[];
  total: number;
  pages: number;
}

const ShopProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getCardCartProps } = useCardCartActions();

  const [data, setData] = useState<ListState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  // نص الاستعلام للباك إند: نفس فلاتر الرابط + حجم الصفحة
  const apiQuery = (() => {
    const q = new URLSearchParams();
    for (const key of FORWARDED_PARAMS) {
      const value = searchParams.get(key);
      if (value) q.set(key, value);
    }
    q.set("limit", String(PAGE_SIZE));
    return q.toString();
  })();

  useEffect(() => {
    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- إظهار التحميل عند تغيّر الفلاتر
    setLoading(true);
    setError("");

    api
      .get(`/product?${apiQuery}`)
      .then((res) => {
        if (cancelled) return;
        setData({
          products: res.data.products ?? [],
          total: res.data.total ?? 0,
          pages: res.data.pages ?? 1,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        // 400 من الباك إند = رابط فيه فلتر غير صالح (عُدّل يدويًا مثلًا)
        const message =
          err?.response?.status === 400
            ? "Some filters in the link are invalid."
            : "Failed to load products.";
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [apiQuery]);

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page <= 1) next.delete("page");
      else next.set("page", String(page));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // يمسح الفلاتر والبحث والترتيب، أي يعود لكل المنتجات
  const clearAll = () => setSearchParams(new URLSearchParams());

  const hasFilters = FORWARDED_PARAMS.some(
    (key) => key !== "page" && searchParams.get(key),
  );

  const renderResults = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Reset filters
          </button>
        </div>
      );
    }

    if (!data) {
      return (
        <p className="py-16 text-center text-sm text-gray-500">
          Loading products...
        </p>
      );
    }

    if (data.products.length === 0) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-16 text-center shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <IconMoodEmpty size={28} />
          </div>
          <p className="text-base font-semibold text-gray-900">
            No products found
          </p>
          <p className="text-sm text-gray-500">
            {hasFilters
              ? "Try removing some filters or changing your search."
              : "There are no products in the store yet."}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="mt-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600">
              Clear all filters
            </button>
          ) : (
            <Link
              to="/"
              className="mt-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-sky-600">
              Back to home
            </Link>
          )}
        </div>
      );
    }

    return (
      // النتائج السابقة تبقى ظاهرة (باهتة) أثناء تحميل الجديدة، بدل وميض الصفحة
      <div
        className={`grid grid-cols-2 gap-2 transition-opacity lg:grid-cols-3 ${
          loading ? "pointer-events-none opacity-50" : ""
        }`}
        aria-busy={loading}>
        {data.products.map((product) => (
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
    );
  };

  return (
    <div>
      <CategoryHeader />
      <SearchCountResult total={loading && !data ? null : (data?.total ?? 0)} />
      <div className="flex flex-col gap-4 px-4 md:flex-row">
        <aside className="w-full shrink-0 md:w-64">
          <SideFilter />
        </aside>
        <main className="min-w-0 flex-1">{renderResults()}</main>
      </div>
      {data && data.pages > 1 && (
        <PaginationComponent
          count={data.pages}
          page={Math.min(currentPage, data.pages)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ShopProductsPage;
