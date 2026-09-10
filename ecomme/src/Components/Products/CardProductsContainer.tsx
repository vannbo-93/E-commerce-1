/** @format */
import ProductCard from "./ProductCard";
import SubTitle from "../Utility/SubTitle";

interface ProductCardContainerProps {
  title: string;
  btntitle: string;
  pathText: string;
}

const CardProductsContainer = ({
  title,
  btntitle,
}: ProductCardContainerProps) => {
  return (
    <div className="container">
      <SubTitle title={title} btnTitle={btntitle} />
      <div className="flex items-center justify-between my-2 m-2 overflow-x-auto">
        <ProductCard id="1" title="Smartphone headset" />
        <ProductCard id="2" title="Smartphone headset" />
        <ProductCard id="3" title="Smartphone headset" />
        <ProductCard id="4" title="Smartphone headset" />
      </div>
    </div>
  );
};

export default CardProductsContainer;
