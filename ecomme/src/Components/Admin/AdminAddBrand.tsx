/** @format */
import AdminImageNameForm from "./AdminImageNameForm";

const AdminAddBrand = () => {
  return (
    <AdminImageNameForm
      title="Add a new brand"
      imageLabel="Brand image"
      nameLabel="Brand name"
      namePlaceholder="Enter brand name"
      onSave={(data) => {
        // TODO: Call the API to save the brand (name + image file).
        console.log("Save brand:", data);
      }}
    />
  );
};

export default AdminAddBrand;
