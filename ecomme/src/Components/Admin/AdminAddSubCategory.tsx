/** @format */
import { useState } from "react";

const AdminAddSubCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("val");

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-white mb-4">Add New Subcategory</h2>

      <div className="bg-[#1E1E2E] border border-gray-700/50 rounded-2xl p-6 w-full">
        <div className="flex flex-col gap-2 mb-5">
          <label htmlFor="subcategory-name"
            className="text-sm font-semibold text-gray-300 underline decoration-blue-400 decoration-1 underline-offset-4"> Subcategory Name
          </label>
          <input id="subcategory-name" type="text" placeholder="Subcategory Name"
            className="h-10 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-white text-sm focus:outline-none focus:border-blue-400"/>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="parent-category"
            className="text-sm font-semibold text-gray-300 underline decoration-blue-400 decoration-1 underline-offset-4">
            Parent Category
          </label>
          <select id="parent-category" name="languages" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-white text-sm focus:outline-none focus:border-blue-400">
            <option value="val">First Category</option>
            <option value="val2">Second Category</option>
            <option value="val3">Third Category</option>
            <option value="val4">Fourth Category</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button className="h-10 px-6 rounded-md bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddSubCategory;
