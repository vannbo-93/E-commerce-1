/** @format */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import CartItem from "../../Components/Cart/CartItem";
import CartCheckout from "../../Components/Cart/CartCheckout";
import smartphone from "../../../src/images/allProducts/smartphone.png";
import watch from "../../../src/images/allProducts/smartwatch.png";

interface CartItemData {
  id: number;
  image: string;
  category: string;
  title: string;
  rate: number;
  brand: string;
  color: string;
  quantity: number;
  price: number;
}

const initialItems: CartItemData[] = [
  {
    id: 1,
    image: watch,
    category: "electronics",
    title: "Smart watch",
    rate: 4.6,
    brand: "LG",
    color: "#2C2CE5",
    quantity: 1,
    price: 78,
  },
  {
    id: 2,
    image: smartphone,
    category: "electronics",
    title: "Samsung Galaxy",
    rate: 4.2,
    brand: "Samsung",
    color: "#f40000",
    quantity: 1,
    price: 560,
  },
];

const CartPage = () => {
  const [items, setItems] = useState<CartItemData[]>(initialItems);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyCoupon = (code: string) => {
    console.log("Applying coupon:", code);
  };

  return (
    <div className="container mx-auto min-h-[680px] px-4 pb-10">
      {/* حجم العنوان بـ style لأن CSS عامًا على h1 قد يتغلب على فئات Tailwind */}
      <div className="mb-5 mt-6 flex items-center gap-3">
        <h1
          className="font-bold text-gray-900 "
          style={{ fontSize: "1.75rem" }}>
          {" "}
          Shopping Cart
        </h1>
        {items.length > 0 ? (
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-600">
            {itemsCount} {itemsCount === 1 ? "item" : "items"}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col items-start gap-6 md:flex-row">
        <div className="w-full rounded-2xl bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] md:w-2/3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                <ShoppingCart size={28} />
              </div>
              <p className="text-base font-semibold text-gray-900">
                {" "}
                Your cart is empty
              </p>
              <p className="text-sm text-gray-500">
                {" "}
                Looks like you haven't added anything yet.
              </p>
              <Link
                to="/shop"
                className="mt-2 rounded-lg bg-sky-500 px-6 py-3 text-sm font-medium text-white no-underline
                 transition-colors hover:bg-sky-600">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 px-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  image={item.image}
                  category={item.category}
                  title={item.title}
                  rate={item.rate}
                  brand={item.brand}
                  color={item.color}
                  quantity={item.quantity}
                  price={item.price}
                  onQuantityChange={(q) => handleQuantityChange(item.id, q)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:sticky md:top-24 md:w-1/3">
          <CartCheckout total={total} onApplyCoupon={handleApplyCoupon} />
        </div>
      </div>
    </div>
  );
};
export default CartPage;
