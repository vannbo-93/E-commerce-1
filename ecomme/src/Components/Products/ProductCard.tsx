/** @format */
import prod1 from "../../images/item.png";
import favoff from "../../images/fav-off.png";
import rate from "../../images/rate.png";
import { Link } from "react-router-dom";

type ProductCardProps = {id: string | number;title?: string;price?: number;ratingValue?: number;};
const ProductCard = ({id,title,price = 880,ratingValue = 4.5,}: ProductCardProps) => {
  return (
    <div className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/3 flex p-2">
      <Link to={`/products/${id}`} className="no-underline w-full">
        <div className="my-2 w-full h-[345px] rounded-lg border-none bg-white
         shadow-[0_2px_2px_0_rgba(151,151,151,0.5)] overflow-hidden">
          <img src={prod1} alt={title || "product"} className="h-[228px] w-full object-cover"/>

          <div className="flex justify-end mx-2">
            <img src={favoff} alt="favorite toggle" className="h-6 w-[26px] text-center"/>
          </div>

          <div className="p-3">
            <div className="card-title font-medium mb-2">
              {title || "ساعة يد ذكية"}
            </div>

            <div className="flex justify-between">
              <div className="flex items-center">
                <img src={rate} alt="rating" className="h-4 w-4" />
                <div className="card-rate mx-2">{ratingValue}</div>
              </div>
              <div className="flex">
                <div className="card-price">{price}</div>
                <div className="card-currency mx-1">MAD</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default ProductCard;
