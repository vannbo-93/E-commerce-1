/** @format */
import ProductCard from "./ProductCard";
import SubTitle from "../Utility/SubTitle";
import charger from "../../../src/images/allProducts/wirelesscharger.png";
import securitycamera from "../../../src/images/allProducts/wificamera.png";
import headset from "../../../src/images/allProducts/headset.png";
import keyboard from "../../../src/images/allProducts/keyboard.png";

interface ProductCardContainerProps {
  title?: string;
  btntitle?: string;
  pathText?: string;
}

// بيانات مؤقتة: استبدلها لاحقًا ببيانات الـ API
const products = [
  {
    id: "1",
    title: "wireless charger",
    image: charger,
    ratingValue: 4.5,
    ratingCount: 56,
    price: 32.99,
    oldPrice: 44.99,
  },
  {
    id: "2",
    title: "security camera",
    image: securitycamera,
    ratingValue: 4.1,
    ratingCount: 34,
    price: 23.99,
    oldPrice: 30.99,
  },
  {
    id: "3",
    title: "headset",
    image: headset,
    ratingValue: 4.4,
    ratingCount: 23,
    price: 236.99,
    oldPrice: 299.99,
  },
  {
    id: "4",
    title: "mechanical keyboard",
    image: keyboard,
    ratingValue: 4.9,
    ratingCount: 655,
    price: 120.99,
    oldPrice: 150.99,
  },
];

const NewArrivals = ({
  title,
  btntitle,
  pathText,
}: ProductCardContainerProps) => {
  return (
    <div className="container">
      {title ? (
        <SubTitle title={title} btnTitle={btntitle} pathText={pathText} />
      ) : null}
      <div className=" grid grid-cols-2 gap-2 md:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="min-w-0">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
