/** @format */
import { useState } from "react";
import CartItem from "../../Components/Cart/CartItem";
import CartCheckout from "../../Components/Cart/CartCheckout";
import mobile from "../../images/mobile.png";

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
    image: mobile,
    category: "electronics",
    title: "iPhone XR with 128GB storage and 4G LTE support",
    rate: 4.5,
    brand: "Apple",
    color: "#E52C2C",
    quantity: 1,
    price: 3000,
  },
  {
    id: 2,
    image: mobile,
    category: "electronics",
    title: "Samsung Galaxy S21",
    rate: 4.2,
    brand: "Samsung",
    color: "#2C2CE5",
    quantity: 1,
    price: 4500,
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

  const handleApplyCoupon = (code: string) => {
    console.log("Applying coupon:", code);
  };

  return (
    <div className="container mx-auto px-4" style={{ minHeight: "680px" }}>
      <h1 className="text-xl font-bold mt-6 mb-4">Shopping Cart</h1>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-2/3 border border-gray-700 rounded-xl px-4">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-500">The cart is empty</div>
          ) : (
            items.map((item) => (
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
            ))
          )}
        </div>

        <div className="w-full md:w-1/3">
          <CartCheckout total={total} onApplyCoupon={handleApplyCoupon} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
