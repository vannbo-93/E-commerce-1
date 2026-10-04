/** @format */
import { useNavigate } from "react-router-dom";
import AdminImageNameForm from "./AdminImageNameForm";
import api from "../../Api/baseURL";
import { isAxiosError } from "axios";
import { invalidateCache } from "../../Api/cachedGet";

const AdminAddCategory = () => {
  const navigate = useNavigate();

  return (
    <AdminImageNameForm
      title="Add a new category"
      imageLabel="Category image"
      nameLabel="Category name"
      namePlaceholder="Enter category name"
      onSave={async (data) => {
        if (!data.file) throw new Error("Please choose an image.");

        // multipart/form-data ضروري هنا لأن data.file ملف حقيقي، لا نص
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("image", data.file);

        try {
          await api.post("/category", formData, {
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

        invalidateCache("/category");
        navigate("/allcategory");
      }}
    />
  );
};

export default AdminAddCategory;
