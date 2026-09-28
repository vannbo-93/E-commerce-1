/** @format */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { IconHeart } from "@tabler/icons-react";
import ProductCard from "../Products/ProductCard";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCardCartActions } from "../../hooks/useCardCartActions";

// عدّلهما إن كانت المسارات مختلفة في الـ Router
const PRODUCTS_PATH = "/products";
const LOGIN_PATH = "/login";

const UserFavoriteProduct = () => {
  const { user, loading: authLoading } = useAuth();
  const { products, loading, error, refresh } = useWishlist();
  const { getCardCartProps } = useCardCartActions();
  const userId = user?.id ?? null;

  // جلب حديث عند فتح الصفحة: قلوب أُضيفت من صفحات أخرى لا تظهر في products حتى يُعاد الجلب
  useEffect(() => {
    if (userId) void refresh();
  }, [userId, refresh]);

  const heading = (
    <h2 className="mb-4 text-xl font-bold text-gray-900">My Favorites</h2>
  );

  if (authLoading || (loading && products.length === 0)) {
    return (
      <div>
        {heading}
        <p className="py-10 text-center text-sm text-gray-500">
          Loading your favorites...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        {heading}
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-gray-600">
            Log in to see your favorite products.
          </p>
          <Link
            to={LOGIN_PATH}
            state={{ from: "/user/favorite" }}
            className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-medium text-white no-underline transition-colors 
            hover:bg-sky-600">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {heading}
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div>
        {heading}
        <div
          className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-14 text-center 
        shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-400">
            <IconHeart size={28} />
          </div>
          <p className="text-base font-semibold text-gray-900">
            No favorites yet
          </p>
          <p className="text-sm text-gray-500">
            Tap the heart on any product to save it here.
          </p>
          <Link
            to={PRODUCTS_PATH}
            className="mt-2 rounded-lg bg-sky-500 px-6 py-3 text-sm font-medium text-white no-underline transition-colors 
            hover:bg-sky-600">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {heading}
      {/* إزالة القلب هنا تُخرج المنتج من القائمة فورًا عبر WishlistContext */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product._id} className="min-w-0">
            <ProductCard
              id={product._id}
              title={product.name}
              image={product.image}
              ratingValue={product.rating.value}
              ratingCount={product.rating.count}
              price={product.price}
              {...(product.priceBeforeDiscount !== null
                ? { oldPrice: product.priceBeforeDiscount }
                : {})}
              hasOptions={product.hasOptions}
              {...getCardCartProps(product._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserFavoriteProduct;
