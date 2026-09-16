/** @format */

import { useRef, useState, type ChangeEvent } from "react";
import ImageIcon from "@mui/icons-material/Image";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const AdminAddBrand = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-white mb-4">Add a new brand</h2>

      <div className="bg-[#1E1E2E] border border-gray-700/50 rounded-2xl p-6 w-full">
        <div className="flex flex-col gap-2 mb-5">
          <label
            htmlFor="brand-image"
            className="text-sm font-semibold text-gray-300 underline decoration-blue-400 decoration-1 underline-offset-4 py-2">
            {" "}
            Brand image
          </label>

          {preview ? (
            <img
              src={preview}
              alt=""
              height="100"
              width="120"
              onClick={handleImageClick}
              className="cursor-pointer rounded-md object-cover"
            />
          ) : (
            <div
              onClick={handleImageClick}
              className="relative cursor-pointer w-[120px] h-[100px] bg-[#2A2A3C] border border-gray-600 rounded-md flex items-center justify-center 
              hover:bg-[#333347] transition-colors">
              <ImageIcon sx={{ fontSize: 28 }} className="text-gray-400" />
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <FileUploadIcon
                  sx={{ fontSize: 14 }}
                  className="text-white animate-pulse-scale"
                />
              </div>
            </div>
          )}

          <input
            id="brand-image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label
            htmlFor="brand-name"
            className="text-sm font-semibold text-gray-300 underline decoration-blue-400 decoration-1 underline-offset-4">
            Brand name
          </label>
          <input
            id="brand-name"
            type="text"
            placeholder="Enter brand name"
            className="h-10 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-white text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        <div className="flex justify-end">
          <button className="h-10 px-6 rounded-md bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddBrand;
