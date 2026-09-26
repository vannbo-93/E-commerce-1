/** @format */
import { useNavigate } from "react-router-dom";
import AdminImageNameForm from "./AdminImageNameForm";
import api from "../../Api/baseURL";
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
        if (!data.file) return;

        // multipart/form-data ضروري هنا لأن data.file ملف حقيقي، لا نص
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("image", data.file);

        try {
          await api.post("/brand", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          navigate("/allbrand");
        } catch (err) {
          const message = isAxiosError(err)
            ? (err.response?.data?.message ?? "Something went wrong")
            : "Something went wrong";
          console.error(message);
        }
      }}
    />
  );
};

export default AdminAddBrand;
