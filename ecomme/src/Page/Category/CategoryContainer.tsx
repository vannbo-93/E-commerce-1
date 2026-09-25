/** @format */
import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import api from "../../Api/baseURL";
import { useAuth } from "../../context/AuthContext";
import { Toast } from "../../Components/Utility/AppAlerts";

interface Category {
  _id: string;
  name: string;
  image: string;
}

const CategoryContainer = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/category")
      .then((res) => {
        if (!cancelled) setCategories(res.data.categories);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load categories.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    // تحديث فوري في الواجهة قبل انتظار رد الخادم، لشعور أسرع
    const previous = categories;
    setCategories((prev) => prev.filter((cat) => cat._id !== id));

    try {
      await api.delete(`/category/${id}`);
      setToastOpen(true);
    } catch {
      // فشل الحذف فعليًا في الخادم: نُعيد العنصر إلى القائمة بدل ترك واجهة كاذبة
      setCategories(previous);
      setError("Failed to delete the category. Please try again.");
    }
  };

  return (
    <div className="my-3 min-h-screen" dir="ltr">
      <div>
        <div className="flex items-center justify-center gap-4 py-3">
          <span className="h-px max-w-24 flex-1 bg-sky-500" />
          <h2 className="text-lg font-semibold text-gray-900">All Category</h2>
          <span className="h-px max-w-24 flex-1 bg-sky-500" />
        </div>

        {loading && (
          <p className="py-10 text-center text-sm text-gray-500">
            Loading categories...
          </p>
        )}

        {!loading && error && (
          <p className="py-10 text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500">
            No categories yet.
          </p>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="mx-4 my-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                id={cat._id}
                title={cat.name}
                img={cat.image}
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Toast
        open={toastOpen}
        message="Category deleted successfully"
        severity="success"
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export default CategoryContainer;
