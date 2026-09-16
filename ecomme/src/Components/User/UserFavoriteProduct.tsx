/** @format */

import ProductCard from "../Products/ProductCard";
import PaginationCompontent from "../Utility/Pagination";

const UserFavoriteProduct = () => {
  const favoriteProducts = ["1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <div className="flex flex-col gap-4">
      <div className="admin-content-text">preferable products</div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {favoriteProducts.map((title, index) => (
          <ProductCard key={index} id={title} title={title} />
        ))}
      </div>

      <div className="w-full md:w-[83.33%]">
        <PaginationCompontent />
      </div>
    </div>
  );
};

export default UserFavoriteProduct;
