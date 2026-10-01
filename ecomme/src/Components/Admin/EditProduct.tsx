/** @format */
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import { IconPlus, IconX } from "@tabler/icons-react";
import ImageIcon from "@mui/icons-material/Image";
import api from "../../Api/baseURL";
import { isAxiosError } from "axios";

type ProductOption = { name: string; id: string };
const MAX_IMAGES = 6;

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

// صورة قديمة (رابط موجود فعليًا)، أو صورة جديدة (ملف لم يُرفع بعد)
type ImageSlot =
  | { kind: "existing"; url: string }
  | { kind: "new"; file: File; preview: string };

// عدد صحيح من 0 فأكثر، كما يشترط الباك إند
const isValidStock = (value: string) =>
  value.trim() !== "" && Number.isInteger(Number(value)) && Number(value) >= 0;

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);

  const [categories, setCategories] = useState<ProductOption[]>([]);
  const [brands, setBrands] = useState<ProductOption[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<ProductOption[]>(
    [],
  );
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [images, setImages] = useState<ImageSlot[]>([]);
  // نسخة دائمة التحديث من الصور: يقرؤها التنظيف عند مغادرة الصفحة
  const imagesRef = useRef<ImageSlot[]>([]);
  // يُحدَّث بعد كل رسم لا أثناءه: React قد يرسم دون أن يعتمد النتيجة
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [priceBeforeDiscount, setPriceBeforeDiscount] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<
    ProductOption[]
  >([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // يحرر معاينات الصور الجديدة فقط عند مغادرة الصفحة.
  // يقرأ imagesRef لا images: images هنا قيمتها من لحظة فتح الصفحة (فارغة)
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => {
        if (img.kind === "new") URL.revokeObjectURL(img.preview);
      });
    };
  }, []);

  useEffect(() => {
    Promise.all([
      api.get("/category"),
      api.get("/brand"),
      api.get("/subcategory"),
    ])
      .then(([catRes, brandRes, subRes]) => {
        setCategories(
          catRes.data.categories.map((c: { _id: string; name: string }) => ({
            id: c._id,
            name: c.name,
          })),
        );
        setBrands(
          brandRes.data.brands.map((b: { _id: string; name: string }) => ({
            id: b._id,
            name: b.name,
          })),
        );
        setSubCategoryOptions(
          subRes.data.subCategories.map((s: { _id: string; name: string }) => ({
            id: s._id,
            name: s.name,
          })),
        );
      })
      .catch(() =>
        setError("Failed to load categories, brands or subcategories."),
      )
      .finally(() => setLoadingOptions(false));
  }, []);

  // يجلب المنتج الحالي ويُعبّئ كل الحقول بقيمه الفعلية
  useEffect(() => {
    if (!id) return;
    api
      .get(`/product/${id}`)
      .then((res) => {
        const p = res.data.product;
        setProductName(p.name);
        setDescription(p.description);
        setPrice(String(p.price));
        setPriceBeforeDiscount(
          p.priceBeforeDiscount ? String(p.priceBeforeDiscount) : "",
        );
        // منتج قديم بلا حقل stock يظهر 0، فيعرف الأدمن أنه نافد
        setStock(String(p.stock ?? 0));
        setMainCategory(p.category?._id ?? "");
        setBrand(p.brand?._id ?? "");
        setColors(p.colors ?? []);
        setSelectedSubCategories(
          (p.subCategories ?? []).map((s: { _id: string; name: string }) => ({
            id: s._id,
            name: s.name,
          })),
        );
        setImages(
          (p.images ?? []).map((url: string) => ({ kind: "existing", url })),
        );
      })
      .catch(() => setLoadError("Failed to load this product."))
      .finally(() => setLoadingProduct(false));
  }, [id]);

  const stockInvalid = stock !== "" && !isValidStock(stock);

  const canSave =
    productName.trim() !== "" &&
    description.trim() !== "" &&
    price !== "" &&
    isValidStock(stock) &&
    mainCategory !== "" &&
    brand !== "" &&
    images.length > 0 &&
    !submitting;

  const handleAddColor = () => colorInputRef.current?.click();
  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const c = e.target.value.toUpperCase();
    setColors((prev) => (prev.includes(c) ? prev : [...prev, c]));
  };
  const handleRemoveColor = (c: string) =>
    setColors((prev) => prev.filter((x) => x !== c));

  const handleImagesClick = () => imageInputRef.current?.click();

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    setImages((prev) => {
      const combined: ImageSlot[] = [
        ...prev,
        ...selected.map((file) => ({
          kind: "new" as const,
          file,
          preview: URL.createObjectURL(file),
        })),
      ];
      if (combined.length > MAX_IMAGES) {
        combined.slice(MAX_IMAGES).forEach((img) => {
          if (img.kind === "new") URL.revokeObjectURL(img.preview);
        });
        return combined.slice(0, MAX_IMAGES);
      }
      return combined;
    });
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const img = prev[index];
      if (img?.kind === "new") URL.revokeObjectURL(img.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSave = async () => {
    // ref: ضغطتان سريعتان قبل تحديث الـ state كانتا ترسلان طلبين
    if (!canSave || !id || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");

    const existingImages = images.flatMap((i) =>
      i.kind === "existing" ? [i.url] : [],
    );
    const newFiles = images.flatMap((i) => (i.kind === "new" ? [i.file] : []));

    const formData = new FormData();
    formData.append("name", productName.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    // يُرسل دائمًا، حتى فارغًا: الفارغ يعني "أزل الخصم" في الباك إند.
    // سابقًا لم يكن يُرسل حين يُمسح، فكان الخصم القديم يبقى إلى الأبد
    formData.append("priceBeforeDiscount", priceBeforeDiscount.trim());
    formData.append("stock", String(Number(stock)));
    formData.append("category", mainCategory);
    formData.append("brand", brand);
    formData.append(
      "subCategories",
      JSON.stringify(selectedSubCategories.map((s) => s.id)),
    );
    formData.append("colors", JSON.stringify(colors));
    formData.append("existingImages", JSON.stringify(existingImages));
    newFiles.forEach((file) => formData.append("images", file));

    try {
      await api.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/allproducts");
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? "Something went wrong")
        : "Something went wrong";
      setError(message);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        Loading product...
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="py-10 text-center text-sm text-red-600">{loadError}</div>
    );
  }

  const stockNumber = Number(stock);

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
        multiple
        onChange={handleImagesChange}
        className="hidden"
      />

      <h2 className="mb-4! pt-3 text-lg! font-bold! text-gray-900 p-4">
        Edit Product
      </h2>

      <div className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        {error && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Field label={`Product images (${images.length}/${MAX_IMAGES})`}>
          <div className="flex flex-wrap items-center gap-3">
            {images.map((img, index) => (
              <div
                key={img.kind === "existing" ? img.url : img.preview}
                className="group relative h-[100px] w-[100px]">
                <img
                  src={img.kind === "existing" ? img.url : img.preview}
                  alt={`Product ${index + 1}`}
                  className="h-full w-full rounded-xl border border-gray-200 bg-slate-50 object-contain p-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white
                  opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                  <IconX size={14} />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-sky-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Main
                  </span>
                )}
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={handleImagesClick}
                aria-label="Add product images"
                className="flex h-[100px] w-[100px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300
                bg-slate-50 text-gray-400 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600">
                <ImageIcon sx={{ fontSize: 24 }} />
                <span className="text-xs">Add image</span>
              </button>
            )}
          </div>
        </Field>

        <Field label="Product name" htmlFor="product-name">
          <input
            id="product-name"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Product description" htmlFor="product-description">
          <textarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={`resize-none py-2 ${baseField}`}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Price before discount" htmlFor="price-before">
            <input
              id="price-before"
              type="number"
              min="0"
              value={priceBeforeDiscount}
              onChange={(e) => setPriceBeforeDiscount(e.target.value)}
              placeholder="No discount"
              className={inputClass}
            />
            <span className="text-xs text-gray-400">
              Clear this field to end the discount.
            </span>
          </Field>
          <Field label="Product price" htmlFor="price">
            <input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Stock (units available)" htmlFor="stock">
            <input
              id="stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              aria-invalid={stockInvalid}
              className={`${inputClass} ${stockInvalid ? "border-red-400" : ""}`}
            />
            {stockInvalid ? (
              <span className="text-xs text-red-600">
                Must be a whole number of 0 or more.
              </span>
            ) : stock !== "" && stockNumber === 0 ? (
              <span className="text-xs text-amber-600">
                Out of stock: customers can't order this product.
              </span>
            ) : null}
          </Field>
        </div>

        <Field label="Main category" htmlFor="main-category">
          <select
            id="main-category"
            value={mainCategory}
            onChange={(e) => setMainCategory(e.target.value)}
            disabled={loadingOptions}
            className={inputClass}>
            <option value="" disabled>
              {loadingOptions ? "Loading..." : "Select a category"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Subcategories" htmlFor="sub-categories">
          <Select<ProductOption, true>
            inputId="sub-categories"
            isMulti
            isLoading={loadingOptions}
            options={subCategoryOptions}
            value={selectedSubCategories}
            onChange={(selected) =>
              setSelectedSubCategories(selected as ProductOption[])
            }
            getOptionLabel={(o) => o.name}
            getOptionValue={(o) => o.id}
            styles={selectStyles}
          />
        </Field>

        <Field label="Brand" htmlFor="brand">
          <select
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={loadingOptions}
            className={inputClass}>
            <option value="" disabled>
              {loadingOptions ? "Loading..." : "Select a brand"}
            </option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Available product colors (optional)">
          <p className="text-xs text-gray-400">
            Leave empty if the product comes in one color only. Customers must
            pick a color for products that have colors.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleRemoveColor(c)}
                aria-label={`Remove color ${c}`}
                title="Click to remove"
                className="group relative h-8 w-8 rounded-full border border-gray-200 transition-transform hover:scale-110"
                style={{ backgroundColor: c }}>
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <IconX size={16} className="text-white" />
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleAddColor}
              aria-label="Add color"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-500 transition-colors
              hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600">
              <IconPlus size={16} />
            </button>
          </div>
        </Field>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!canSave}
            className="h-10 rounded-lg bg-sky-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed
            disabled:opacity-50 disabled:hover:bg-sky-500">
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
