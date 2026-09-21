/** @format */

import ProductCard from "../Products/ProductCard";
import PaginationCompontent from "../Utility/Pagination";
import smartphone from "../../images/allProducts/smartphone.png";

const UserFavoriteProduct = () => {
  const favoriteProducts = ["1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-bold text-gray-900">Wishlist</div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {favoriteProducts.map((title) => (
          <ProductCard
            key={title}
            id={title}
            title={title}
            image={smartphone}
            ratingValue={0}
            price={0}
          />
        ))}
      </div>

      <div className="flex w-full justify-center">
        <PaginationCompontent />
      </div>
    </div>
  );
};

export default UserFavoriteProduct;
