/** @format */
import AdminAllProductsCard from "./AdminAllProductsCard";
import prod1 from "../../images/prod1.png";

interface Product {
  id: string | number;
  image: string;
  title: string;
  rate: number;
  price: number;
}
const mockProducts: Product[] = [
  {  id: 1, image: prod1, title: "Peb S Smart Watch Carbon Black", rate: 4.5, price: 880, },
  { id: 2, image: prod1, title: "Wireless Bluetooth Headphones", rate: 4.2, price: 450 },
  { id: 3, image: prod1, title: "65W Fast Charger", rate: 4.7, price: 220 },
  {id: 4,image: prod1,title: "Mechanical Keyboard", rate: 4.3, price: 650,},
  { id: 5, image: prod1, title: "Wireless Mouse", rate: 4.0, price: 180 },
  { id: 6, image: prod1, title: "Laptop Backpack", rate: 4.6, price: 320 },
];

const AdminAllProducts = () => {
  const handleDelete = (id: Product["id"]) => {
    console.log("Delete product:", id);
  };

  const handleEdit = (id: Product["id"]) => {
    console.log("Edit product:", id);
  };
  return (
    <div>
      <h2 className="admin-content-text text-lg font-semibold !mb-8"> Manage all products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockProducts.map((product) => (
          <AdminAllProductsCard
            key={product.id}
            id={product.id}
            image={product.image}
            title={product.title}
            rate={product.rate}
            price={product.price}
            onDelete={() => handleDelete(product.id)}
            onEdit={() => handleEdit(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminAllProducts;
