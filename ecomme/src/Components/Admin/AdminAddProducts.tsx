/** @format */
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import { IconPlus } from "@tabler/icons-react";
import ImageIcon from "@mui/icons-material/Image";
import FileUploadIcon from "@mui/icons-material/FileUpload";

type ProductOption = { name: string; id: number };

// بيانات تجريبية: استبدلها بقائمة من الخادم
const subCategoryOptions: ProductOption[] = [
  { name: "First Category", id: 1 },
  { name: "Second Category", id: 2 },
];

const baseField =
  "rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40";
const inputClass = `h-10 ${baseField}`;

const Field = ({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    {htmlFor ? (
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {" "}
        {label}
      </label>
    ) : (
      <span className="text-sm font-medium text-gray-700">{label}</span>
    )}
    {children}
  </div>
);

const selectStyles: StylesConfig<ProductOption, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f9fafb",
    borderColor: state.isFocused ? "#38bdf8" : "#e5e7eb",
    borderRadius: "0.5rem",
    minHeight: "2.5rem",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(56,189,248,0.4)" : "none",
    "&:hover": { borderColor: "#38bdf8" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
    zIndex: 20,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f0f9ff" : "#ffffff",
    color: state.isFocused ? "#0284c7" : "#111827",
    cursor: "pointer",
    "&:active": { backgroundColor: "#e0f2fe" },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e0f2fe",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (base) => ({ ...base, color: "#0369a1" }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#0369a1",
    "&:hover": { backgroundColor: "#fee2e2", color: "#dc2626" },
  }),
  input: (base) => ({ ...base, color: "#111827" }),
  placeholder: (base) => ({ ...base, color: "#9ca3af" }),
  singleValue: (base) => ({ ...base, color: "#111827" }),
};

const AdminAddProducts = () => {
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [priceBeforeDiscount, setPriceBeforeDiscount] = useState("");
  const [price, setPrice] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState(["#E52C2C", "#FFFFFF", "#000000"]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<
    ProductOption[]
  >([]);

  // يحرر الذاكرة عند تغيير الصورة أو مغادرة الصفحة
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const canSave =
    productName.trim() !== "" &&
    price !== "" &&
    mainCategory !== "" &&
    brand !== "";

  const handleAddColor = () => {
    colorInputRef.current?.click();
  };

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedColor = event.target.value.toUpperCase();
    setColors((prev) =>
      prev.includes(selectedColor) ? prev : [...prev, selectedColor],
    );
  };

  const handleRemoveColor = (color: string) => {
    setColors((prev) => prev.filter((c) => c !== color));
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // TODO: Call the API to save the product.
    console.log("Save product:", {
      productName: productName.trim(),
      description,
      priceBeforeDiscount,
      price,
      mainCategory,
      subCategories: selectedSubCategories.map((s) => s.id),
      brand,
      colors,
      imageFile,
    });
  };

  return (
    <div className="w-full">
      <input
        ref={colorInputRef}
        type="color"
        onChange={handleColorChange}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      <h2 className="mb-4! text-lg! font-bold! text-gray-900 pt-3">
        Add New Product
      </h2>

      <div className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <Field label="Product image">
          <button
            type="button"
            onClick={handleImageClick}
            aria-label={
              preview ? "Change product image" : "Upload product image"
            }
            className="relative flex h-[100px] w-[120px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-slate-50 transition-colors 
            hover:border-sky-400 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400/40">
            {preview ? (
              <img
                src={preview}
                alt="Product preview"
                className="h-full w-full rounded-xl object-contain p-2"
              />
            ) : (
              <>
                <ImageIcon sx={{ fontSize: 28 }} className="text-gray-400" />
                <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500">
                  <FileUploadIcon
                    sx={{ fontSize: 14 }}
                    className="animate-pulse-scale text-white"
                  />
                </span>
              </>
            )}
          </button>
        </Field>

        <Field label="Product name" htmlFor="product-name">
          <input
            id="product-name"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            className={inputClass}
          />
        </Field>

        <Field label="Product description" htmlFor="product-description">
          <textarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Enter product description"
            className={`resize-none py-2 ${baseField}`}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Price before discount" htmlFor="price-before">
            <input
              id="price-before"
              type="number"
              min="0"
              value={priceBeforeDiscount}
              onChange={(e) => setPriceBeforeDiscount(e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </Field>
          <Field label="Product price" htmlFor="price">
            <input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Main category" htmlFor="main-category">
          <select
            id="main-category"
            value={mainCategory}
            onChange={(e) => setMainCategory(e.target.value)}
            className={inputClass}>
            <option value="" disabled>
              Select a category
            </option>
            <option value="val1">First Category</option>
            <option value="val2">Second Category</option>
            <option value="val3">Third Category</option>
            <option value="val4">Fourth Category</option>
          </select>
        </Field>

        <Field label="Subcategories" htmlFor="sub-categories">
          <Select<ProductOption, true>
            inputId="sub-categories"
            isMulti
            options={subCategoryOptions}
            value={selectedSubCategories}
            onChange={(selected) =>
              setSelectedSubCategories(selected as ProductOption[])
            }
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id.toString()}
            placeholder="Select subcategories"
            styles={selectStyles}
          />
        </Field>

        <Field label="Brand" htmlFor="brand">
          <select
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={inputClass}>
            <option value="" disabled>
              Select a brand
            </option>
            <option value="val1">First Brand</option>
            <option value="val2">Second Brand</option>
            <option value="val3">Third Brand</option>
          </select>
        </Field>

        <Field label="Available product colors">
          <div className="flex flex-wrap items-center gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleRemoveColor(c)}
                aria-label={`Remove color ${c}`}
                title="Click to remove"
                className="h-7 w-7 rounded-full border border-gray-200 transition-shadow hover:ring-2 hover:ring-red-300"
                style={{ backgroundColor: c }}
              />
            ))}
            <button
              type="button"
              onClick={handleAddColor}
              aria-label="Add color"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-500 transition-colors hover:border-sky-400 
              hover:bg-sky-50 hover:text-sky-600">
              <IconPlus size={16} />
            </button>
          </div>
        </Field>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="h-10 rounded-lg bg-sky-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 
            disabled:hover:bg-sky-500">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProducts;
