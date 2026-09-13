/** @format */
import ProductGallery from "./ProductGallery";
import ProductsText from "./ProductText";

const ProductDetails = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-4 py-3">
        <div className="w-full lg:w-1/3">
          <ProductGallery />
        </div>
        <div className="w-full lg:w-2/3">
          <ProductsText />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
 