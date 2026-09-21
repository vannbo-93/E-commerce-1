/** @format */
import AdminImageNameForm from "./AdminImageNameForm";

const AdminAddCategory = () => {
  return (
    <AdminImageNameForm
      title="Add a new category"
      imageLabel="Category image"
      nameLabel="Category name"
      namePlaceholder="Enter category name"
      onSave={(data) => {
        // TODO: Call the API to save the category (name + image file).
        console.log("Save category:", data);
      }}
    />
  );
};

export default AdminAddCategory;
