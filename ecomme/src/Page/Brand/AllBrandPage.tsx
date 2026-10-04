/** @format */
import { useEffect, useState } from "react";
import BrandCard from "./BrandCard.js";
import SubTitle from "../../Components/Utility/SubTitle.js";
import api from "../../Api/baseURL";
import { cachedGet, invalidateCache } from "../../Api/cachedGet";
import { useAuth } from "../../context/AuthContext";
import { Toast } from "../../Components/Utility/AppAlerts";

interface Brand {
  _id: string;
  name: string;
  image: string;
}

const AllBrandPage = ({
  title,
  pathText,
}: {
  title: string;
  pathText: string;
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    cachedGet<{ brands?: Brand[] }>("/brand")
      .then((data) => {
        if (!cancelled) setBrands(data.brands ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load brands.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    const previous = brands;
    setBrands((prev) => prev.filter((b) => b._id !== id));

    try {
      await api.delete(`/brand/${id}`);
      invalidateCache("/brand");
      setToast({ message: "Brand deleted successfully", severity: "success" });
    } catch {
      // نُعيد القائمة ونُبقيها ظاهرة، والخطأ في تنبيه لا يحل محل الصفحة
      setBrands(previous);
      setToast({
        message: "Failed to delete the brand. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div className="w-full">
      <SubTitle title={title} pathText={pathText} />

      {loading && (
        <p className="py-10 text-center text-sm text-gray-500">
          Loading brands...
        </p>
      )}

      {!loading && error && (
        <p className="py-10 text-center text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && brands.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500">
          No brands yet.
        </p>
      )}

      {!loading && !error && brands.length > 0 && (
        <div className="my-2 grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {brands.map((brand) => (
            <BrandCard
              key={brand._id}
              id={brand._id}
              name={brand.name}
              img={brand.image}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Toast
        open={toast !== null}
        message={toast?.message ?? ""}
        severity={toast?.severity ?? "success"}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default AllBrandPage;
