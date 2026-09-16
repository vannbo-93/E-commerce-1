/** @format */
import { useRef, useState } from "react";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import add from "../../images/add.png";
import ImageIcon from "@mui/icons-material/Image";
import FileUploadIcon from "@mui/icons-material/FileUpload";

type ProductOption = {
  name: string;
  id: number;
};

const AdminAddProducts = () => {
  const options: ProductOption[] = [
    { name: "First Category", id: 1 },
    { name: "Second Category", id: 2 },
  ];

  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [priceBeforeDiscount, setPriceBeforeDiscount] = useState("");
  const [price, setPrice] = useState("");
  const [mainCategory, setMainCategory] = useState("val");
  const [brand, setBrand] = useState("val");
  const [colors, setColors] = useState(["#E52C2C", "#FFFFFF", "#000000"]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<ProductOption[]>([]);

  const handleAddColor = () => { colorInputRef.current?.click();};

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = event.target.value;
    setColors((prevColors) => prevColors.includes(selectedColor) ? prevColors : [...prevColors, selectedColor], );};

  const handleImageClick = () => { imageInputRef.current?.click(); };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0];

    if (file) { setPreview(URL.createObjectURL(file));}
  };

  const selectStyles: StylesConfig<ProductOption, true> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#2A2A3C",
      borderColor: state.isFocused ? "#fb923c" : "#4B5563",
      borderRadius: "0.375rem",
      minHeight: "2.5rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#fb923c",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#2A2A3C",
      border: "1px solid #4B5563",
      zIndex: 20,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#3A3A4C" : "#2A2A3C",
      color: "white",
      cursor: "pointer",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#3A3A4C",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#f87171",
      "&:hover": {
        backgroundColor: "#7f1d1d",
        color: "white",
      },
    }),
    input: (base) => ({
      ...base,
      color: "white",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
  };

  return (
    <div className="w-full">
      <input ref={colorInputRef} type="color" onChange={handleColorChange} className="hidden"/>
      <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
      <h2 className="text-lg font-bold text-white mb-4">Add New Product</h2>

      <div className="bg-[#1E1E2E] border border-gray-700/50 rounded-2xl p-6 w-full sm:w-8/12 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-300 underline decoration-blue-400 decoration-1 underline-offset-4">
            Product Images
          </label>
          {preview ? (
            <img src={preview} alt="" height="100" width="120" onClick={handleImageClick} className="cursor-pointer rounded-md object-cover"/>
          ) : (
            <div
              onClick={handleImageClick}
              className="relative cursor-pointer w-[120px] h-[100px] bg-[#2A2A3C] border border-gray-600 rounded-md flex items-center justify-center 
              hover:bg-[#333347] transition-colors">
              <ImageIcon sx={{ fontSize: 28 }} className="text-gray-400" />
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <FileUploadIcon sx={{ fontSize: 14 }} className="text-white animate-pulse-scale"/>
              </div>
            </div>
          )}
        </div>

        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name" className="h-10 bg-[#2A2A3C] 
        border border-gray-600 rounded-md px-3 text-white text-sm focus:outline-none focus:border-blue-400"/>

        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Product Description"
          className="bg-[#2A2A3C] border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400 resize-none"/>

        <input type="number" value={priceBeforeDiscount} onChange={(e) => setPriceBeforeDiscount(e.target.value)} placeholder="Price Before Discount"
          className="h-10 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-white text-sm focus:outline-none focus:border-blue-400"/>

        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Product Price" className="h-10 bg-[#2A2A3C] 
        border border-gray-600 rounded-md px-3 text-white text-sm focus:outline-none focus:border-blue-400"/>

        <select value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} 
        className="h-10 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-white text-sm focus:outline-none focus:border-blue-400"> 
        <option value="val">Main Category</option> <option value="val1">First Category</option> <option value="val2">Second Category</option> 
        <option value="val3">Third Category</option> <option value="val4">Fourth Category</option>
        </select>

        <Select<ProductOption, true> isMulti options={options} value={selectedSubCategories} onChange={(selected) => setSelectedSubCategories(selected as ProductOption[]) }
          getOptionLabel={(option) => option.name} getOptionValue={(option) => option.id.toString()} placeholder="Subcategory" styles={selectStyles}/>

        <select
          value={brand} onChange={(e) => setBrand(e.target.value)}
          className="h-10 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-white text-sm focus:outline-none focus:border-blue-400">
          <option value="val">Brand</option> <option value="val1">First Brand</option> <option value="val2">Second Brand</option> <option value="val3">Third Brand</option>
        </select>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-300"> Available Product Colors</label>
          <div className="flex items-center gap-2">
            {colors.map((c, i) => (
              <div key={i} className="w-6 h-6 rounded-full border border-gray-500" style={{ backgroundColor: c }}></div> ))}
            <img src={add} alt="Add Color" width="30" height="35" className="cursor-pointer" onClick={handleAddColor}/>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="h-10 px-6 rounded-md bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"> Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProducts;
