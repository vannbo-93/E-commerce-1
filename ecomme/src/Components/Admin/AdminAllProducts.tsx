/** @format */
import { useEffect, useState } from "react";
import type { AlertColor } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminAllProductsCard from "./AdminAllProductsCard";
import { ConfirmDialog, Toast } from "./AppAlerts";
import api from "../../Api/baseURL";

interface RawProduct {
  _id: string;
  name: string;
  images: string[];
  price: number;
  rating: { value: number; count: number };
}

interface Product {
  id: string;
  image: string;
  title: string;
  rate: number;
  price: number;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const AdminAllProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    let cancelled = false;

    api
      .get("/product")
      .then((res) => {
        if (cancelled) return;
        const mapped: Product[] = res.data.products.map((p: RawProduct) => ({
          id: p._id,
          image: p.images?.[0] ?? "",
          title: p.name,
          rate: p.rating?.value ?? 0,
          price: p.price,
        }));
        setProducts(mapped);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load products.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const productToDelete = products.find((p) => p.id === deleteId);

  const handleDelete = (id: string) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;
    const idToDelete = deleteId;
    const previous = products;

    setDeleteId(null);
    setProducts((prev) => prev.filter((p) => p.id !== idToDelete));

    try {
      await api.delete(`/product/${idToDelete}`);
      setToast({
        open: true,
        message: "Product deleted successfully",
        severity: "success",
      });
    } catch {
      // فشل الحذف فعليًا في الخادم: نُعيد المنتج للقائمة بدل واجهة كاذبة
      setProducts(previous);
      setToast({
        open: true,
        message: "Failed to delete the product. Please try again.",
        severity: "error",
      });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/editproduct/${id}`);
  };

  return (
    <div>
      <h2 className="mb-8! pt-4 text-lg font-semibold text-gray-900">
        Manage all products
      </h2>

      {loading && (
        <p className="py-10 text-center text-sm text-gray-500">
          Loading products...
        </p>
      )}

      {!loading && error && (
        <p className="py-10 text-center text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500">
          No products yet.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
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
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete product"
        message={`"${productToDelete?.title ?? ""}" will be permanently deleted, including its image. This can't be undone.`}
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
