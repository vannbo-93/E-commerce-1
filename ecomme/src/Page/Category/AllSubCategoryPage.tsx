/** @format */
import { useEffect, useState } from "react";
import SubCategoryCard from "./SubCategoryCard";
import api from "../../Api/baseURL";
import { useAuth } from "../../context/AuthContext";
import { Toast } from "../../Components/Utility/AppAlerts";

interface SubCategory {
  _id: string;
  name: string;
  category: { _id: string; name: string } | null;
}

const AllSubCategoryPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/subcategory")
      .then((res) => {
        if (!cancelled) setSubCategories(res.data.subCategories);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load subcategories.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    const previous = subCategories;
    setSubCategories((prev) => prev.filter((s) => s._id !== id));

    try {
      await api.delete(`/subcategory/${id}`);
      setToastOpen(true);
    } catch {
      setSubCategories(previous);
      setError("Failed to delete the subcategory. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <h2 className="mb-4 pt-3 text-lg font-bold text-gray-900 p-4">
        All Subcategories
      </h2>

      {loading && (
        <p className="py-10 text-center text-sm text-gray-500">
          Loading subcategories...
        </p>
      )}

      {!loading && error && (
        <p className="py-10 text-center text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && subCategories.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500">
          No subcategories yet.
        </p>
      )}

      {!loading && !error && subCategories.length > 0 && (
        <div className="flex flex-col gap-3">
          {subCategories.map((sub) => (
            <SubCategoryCard
              key={sub._id}
              id={sub._id}
              name={sub.name}
              categoryName={sub.category?.name ?? "Unknown category"}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Toast
        open={toastOpen}
        message="Subcategory deleted successfully"
        severity="success"
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export default AllSubCategoryPage;
