/** @format */
import CardProductsContainer, {
  type ProductCardContainerProps,
} from "./CardProductsContainer";

// نفس بطاقات Featured Products ونفس منطق السلة، لكن الأحدث أولًا
const NewArrivals = (props: Omit<ProductCardContainerProps, "sort">) => {
  return (
    <div className="container">
      <CardProductsContainer {...props} sort="newest" />
    </div>
  );
};

export default NewArrivals;
