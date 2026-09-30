/** @format */
import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

// نفس الحقول في الإضافة والتعديل: تُعرَّف مرة واحدة هنا
export interface AddressFormValues {
  label: string;
  fullName: string;
  phone: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
}

// Shared by the create and edit forms; this export is intentionally kept here.
// eslint-disable-next-line react-refresh/only-export-components
export const EMPTY_ADDRESS: AddressFormValues = {
  label: "Home",
  fullName: "",
  phone: "",
  city: "",
  street: "",
  postalCode: "",
  isDefault: false,
};

interface AddressFormProps {
  initialValues: AddressFormValues;
  submitLabel: string;
  // يرمي خطأ برسالة جاهزة للعرض عند الفشل
  onSubmit: (values: AddressFormValues) => Promise<void>;
  // العنوان الافتراضي لا يُلغى من هنا: يصبح غيره افتراضيًا بدلًا منه
  lockDefault?: boolean;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 disabled:opacity-60";

const LABEL_SUGGESTIONS = ["Home", "Work", "Other"];

const AddressForm = ({
  initialValues,
  submitLabel,
  onSubmit,
  lockDefault = false,
}: AddressFormProps) => {
  const [values, setValues] = useState<AddressFormValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submittingRef = useRef(false);

  const set = <K extends keyof AddressFormValues>(
    key: K,
    value: AddressFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const canSubmit =
    values.fullName.trim() !== "" &&
    values.phone.trim() !== "" &&
    values.city.trim() !== "" &&
    values.street.trim() !== "" &&
    !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const field = (
    key: "fullName" | "phone" | "city" | "street" | "postalCode",
    label: string,
    options: {
      maxLength: number;
      autoComplete: string;
      type?: string;
      optional?: boolean;
      placeholder?: string;
    },
  ) => (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={`address-${key}`}
        className="text-sm font-medium text-gray-700">
        {label}
        {options.optional && (
          <span className="font-normal text-gray-400"> (optional)</span>
        )}
      </label>
      <input
        id={`address-${key}`}
        type={options.type ?? "text"}
        value={values[key]}
        onChange={(e) => set(key, e.target.value)}
        maxLength={options.maxLength}
        autoComplete={options.autoComplete}
        placeholder={options.placeholder}
        disabled={submitting}
        className={inputClass}
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.08)] md:p-6">
      {/* التسمية: اقتراحات سريعة، مع إمكانية كتابة تسمية خاصة */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="address-label"
          className="text-sm font-medium text-gray-700">
          Label
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {LABEL_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("label", s)}
              disabled={submitting}
              aria-pressed={values.label === s}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                values.label === s
                  ? "bg-sky-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600"
              }`}>
              {s}
            </button>
          ))}
          <input
            id="address-label"
            value={values.label}
            onChange={(e) => set("label", e.target.value)}
            maxLength={30}
            disabled={submitting}
            className={`${inputClass} max-w-[180px]`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("fullName", "Recipient name", {
          maxLength: 100,
          autoComplete: "name",
        })}
        {field("phone", "Phone number", {
          maxLength: 20,
          autoComplete: "tel",
          type: "tel",
        })}
        {field("city", "City", {
          maxLength: 60,
          autoComplete: "address-level2",
        })}
        {field("postalCode", "Postal code", {
          maxLength: 12,
          autoComplete: "postal-code",
          optional: true,
        })}
      </div>

      {field("street", "Address", {
        maxLength: 200,
        autoComplete: "street-address",
        placeholder: "Street, building, apartment",
      })}

      <label
        className={`flex items-center gap-2.5 text-sm ${
          lockDefault ? "text-gray-400" : "cursor-pointer text-gray-700"
        }`}>
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(e) => set("isDefault", e.target.checked)}
          disabled={submitting || lockDefault}
          className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-2 focus:ring-sky-400/40"
        />
        {lockDefault
          ? "This is your default address"
          : "Set as default address"}
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600 
          disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500">
          {submitting ? "Saving..." : submitLabel}
        </button>
        <Link
          to="/user/address"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 no-underline hover:bg-gray-100">
          Cancel
        </Link>
      </div>
    </form>
  );
};

export default AddressForm;
