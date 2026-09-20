/** @format */
import ProductCard from "./ProductCard";
import SubTitle from "../Utility/SubTitle";
import fitness from "../../../src/images/allProducts/tracker.png";
import drone from "../../../src/images/allProducts/drone.png";
import headphones from "../../../src/images/allProducts/wirelessheadphones.png";
import earbuds from "../../../src/images/allProducts/wirelessearbuds.png";

interface ProductCardContainerProps {
  title?: string;
  btntitle?: string;
  pathText?: string;
}
// بيانات مؤقتة: استبدلها لاحقًا ببيانات الـ API
const products = [
  {
    id: "1",
    title: "fitness tracke",
    image: fitness,
    ratingValue: 4.5,
    ratingCount: 33,
    price: 54.99,
    oldPrice: 70.99,
  },
  {
    id: "2",
    title: "camera drone",
    image: drone,
    ratingValue: 4.6,
    ratingCount: 128,
    price: 699.99,
    oldPrice: 700.99,
  },
  {
    id: "3",
    title: "wireless headphones",
    image: headphones,
    ratingValue: 4.9,
    ratingCount: 76,
    price: 99.99,
    oldPrice: 129.99,
  },
  {
    id: "4",
    title: "wireless earbuds",
    image: earbuds,
    ratingValue: 4.3,
    ratingCount: 45,
    price: 89.99,
    oldPrice: 112.99,
  },
];

const CardProductsContainer = ({
  title,
  btntitle,
  pathText,
}: ProductCardContainerProps) => {
  return (
    <div className="container">
      {title ? (
        <SubTitle title={title} btnTitle={btntitle} pathText={pathText} />
      ) : null}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="min-w-0">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardProductsContainer;
