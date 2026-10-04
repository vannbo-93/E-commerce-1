/** @format */
import { useNavigate } from "react-router-dom";
import AdminImageNameForm from "./AdminImageNameForm";
import api from "../../Api/baseURL";
import { invalidateCache } from "../../Api/cachedGet";
import { isAxiosError } from "axios";

const AdminAddBrand = () => {
  const navigate = useNavigate();

  return (
    <AdminImageNameForm
      title="Add a new brand"
      imageLabel="Brand image"
      nameLabel="Brand name"
      namePlaceholder="Enter brand name"
      onSave={async (data) => {
        if (!data.file) throw new Error("Please choose an image.");

        // multipart/form-data ضروري هنا لأن data.file ملف حقيقي، لا نص
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("image", data.file);

        try {
          await api.post("/brand", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (err) {
          throw new Error(
            isAxiosError(err)
              ? (err.response?.data?.message ?? "Something went wrong")
              : "Something went wrong",
            { cause: err },
          );
        }

        // قبل الانتقال: صفحة الماركات وفلاتر المتجر تقرأ من الذاكرة المؤقتة
        invalidateCache("/brand");
        navigate("/allbrand");
      }}
    />
  );
};

export default AdminAddBrand;
