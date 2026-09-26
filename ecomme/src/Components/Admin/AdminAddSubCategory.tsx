/** @format */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/baseURL";
import { isAxiosError } from "axios";

interface Category {
  _id: string;
  name: string;
}

const fieldClass =
  "h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40";
//  "h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 
// focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40";

const AdminAddSubCategory = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // يجلب التصنيفات الحقيقية لتعبئة القائمة، بدل الخيارات الوهمية الثابتة
  useEffect(() => {
    api
      .get("/category")
      .then((res) => setCategories(res.data.categories))
      .catch(() => setError("Failed to load categories."))
      .finally(() => setLoadingCategories(false));
  }, []);

  const canSave = name.trim() !== "" && parentCategory !== "" && !submitting;

  const handleSave = async () => {
    if (!canSave) return;
    setSubmitting(true);
    setError("");

    try {
      await api.post("/subcategory", {
        name: name.trim(),
        category: parentCategory,
      });
      navigate("/admin/allsubcategories");
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? "Something went wrong")
        : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="mb-4! pt-3 text-lg! font-bold! text-gray-900">
        Add New Subcategory
      </h2>

      <div className="w-full rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-5 flex flex-col gap-2">
          <label
            htmlFor="subcategory-name"
            className="text-sm font-medium text-gray-700">
            Subcategory name
          </label>
          <input
            id="subcategory-name"
            type="text"
            placeholder="Enter subcategory name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <label
            htmlFor="parent-category"
            className="text-sm font-medium text-gray-700">
            Parent category
          </label>
          <select
            id="parent-category"
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
            disabled={loadingCategories}
            className={fieldClass}>
            <option value="" disabled>
              {loadingCategories
                ? "Loading categories..."
                : "Select a category"}
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="h-10 rounded-lg bg-sky-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-600 
            disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500">
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddSubCategory;
