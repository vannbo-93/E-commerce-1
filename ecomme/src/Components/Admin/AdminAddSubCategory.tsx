/** @format */
import { useState } from "react";
const fieldClass =
  "h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40";
const AdminAddSubCategory = () => {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");

  const canSave = name.trim() !== "" && parentCategory !== "";

  const handleSave = () => {
    // TODO: Call the API to save the subcategory.
    console.log("Save subcategory:", { name: name.trim(), parentCategory });
  };

  return (
    <div className="w-full">
      <h2 className="mb-4! text-lg! font-bold! text-gray-900 pt-3">
        {" "}
        Add New Subcategory
      </h2>

      <div className="w-full rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <div className="mb-5 flex flex-col gap-2">
          <label
            htmlFor="subcategory-name"
            className="text-sm font-medium text-gray-700">
            {" "}
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
            {" "}
            Parent category
          </label>
          <select
            id="parent-category"
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
            className={fieldClass}>
            <option value="" disabled>
              {" "}
              Select a category
            </option>
            <option value="val">First Category</option>
            <option value="val2">Second Category</option>
            <option value="val3">Third Category</option>
            <option value="val4">Fourth Category</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="h-10 rounded-lg bg-sky-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed 
            disabled:opacity-50 disabled:hover:bg-sky-500">
            {" "}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminAddSubCategory;
