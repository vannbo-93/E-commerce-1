/** @format */
import { useState } from "react";
import type { AlertColor } from "@mui/material";
import AdminAllProductsCard from "./AdminAllProductsCard";
import { ConfirmDialog, Toast } from "./AppAlerts";
import camera from "../../images/allProducts/camera.png";
import controller from "../../images/allProducts/controller.png";
import smartphone from "../../images/allProducts/smartphone.png";
import watch from "../../images/allProducts/smartwatch.png";
import microphone from "../../images/allProducts/microphone.png";
import tracker from "../../images/allProducts/tracker.png";

interface Product { id: string | number; image: string; title: string; rate: number; price: number;
}
const mockProducts: Product[] = [
  { id: 1, image: camera, title: "action camera", rate: 4.5, price: 128 },
  { id: 2, image: controller, title: "gaming controller", rate: 4.2, price: 45,},
  { id: 3, image: smartphone, title: "smart phone", rate: 4.7, price: 220 },
  { id: 4, image: watch, title: "smart watch", rate: 4.3, price: 65 },
  { id: 5, image: tracker, title: "fitness tracker band", rate: 4.0, price: 122,},
  { id: 6, image: microphone, title: "usb microphone", rate: 4.6, price: 320 },
];

interface ToastState { open: boolean; message: string; severity: AlertColor;
}

const AdminAllProducts = () => {
  const [deleteId, setDeleteId] = useState<Product["id"] | null>(null);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  const productToDelete = mockProducts.find((p) => p.id === deleteId);

  const handleDelete = (id: Product["id"]) => setDeleteId(id);

  const confirmDelete = () => {
    // TODO: Call the delete API, then show success or error based on the result.
    console.log("Delete product:", deleteId);
    setDeleteId(null);
    setToast({
      open: true,
      message: "Product deleted successfully",
      severity: "success",
    });
  };

  const handleEdit = (id: Product["id"]) => {
    console.log("Edit product:", id);
  };

  return (
    <div>
      <h2 className="admin-content-text text-lg font-semibold !mb-8 pt-4">
        {" "}
        Manage all products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ">
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

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete product"
        message={`"${productToDelete?.title ?? ""}" will be permanently deleted. This can't be undone.`}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </div>
  );
};

export default AdminAllProducts;
