/** @format */
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

// TODO: load the real address from the API instead of this mock data.
const initialAddress = {
  label: "Home",
  details: "Let Al Amal knetra morocco",
  phone: "+212667500649",
};

const LABEL_OPTIONS = ["Home", "Work", "Other"];
const DETAILS_MAX = 200;

const baseField =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40";
//  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400
//  focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40";

const UserEditAddress = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialAddress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isComplete =
    form.label.trim() !== "" &&
    form.details.trim() !== "" &&
    form.phone.trim() !== "";

  const isChanged =
    form.label !== initialAddress.label ||
    form.details !== initialAddress.details ||
    form.phone !== initialAddress.phone;

  // تحذير المتصفح قبل إغلاق الصفحة أو تحديثها مع تغييرات غير محفوظة
  useEffect(() => {
    if (!isChanged || saving) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isChanged, saving]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      // TODO: await the real API call here, e.g. await updateAddress(id, form).
      console.log(form);
      navigate("/user/address");
    } catch {
      setError("We couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4 text-lg font-bold text-gray-900">Edit Address</div>

      <div className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        {error && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="address-label"
            className="text-sm font-medium text-gray-700">
            Address label
          </label>
          <div className="flex flex-wrap gap-2">
            {LABEL_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={form.label === option}
                onClick={() => setForm((prev) => ({ ...prev, label: option }))}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  form.label === option
                    ? "border-sky-500 bg-sky-500 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                }`}>
                {option}
              </button>
            ))}
          </div>
          <input
            id="address-label"
            type="text"
            name="label"
            value={form.label}
            onChange={handleChange}
            placeholder="Or type your own label"
            maxLength={30}
            required
            className={`h-10 ${baseField}`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="address-details"
            className="text-sm font-medium text-gray-700">
            Address details
          </label>
          <textarea
            id="address-details"
            name="details"
            value={form.details}
            onChange={handleChange}
            rows={4}
            maxLength={DETAILS_MAX}
            placeholder="Street, neighborhood, city"
            required
            className={`resize-none py-2 ${baseField}`}
          />
          <span className="self-end text-xs text-gray-400">
            {form.details.length}/{DETAILS_MAX}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="address-phone"
            className="text-sm font-medium text-gray-700">
            {" "}
            Phone number
          </label>
          <input
            id="address-phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+212 ..."
            autoComplete="tel"
            pattern="\+?[0-9 ]{8,20}"
            title="Digits only, with an optional + at the start. Example: +212 6 00 00 00 00"
            required
            className={`h-10 ${baseField}`}
          />
          <span className="text-xs text-gray-400">
            Include the country code so the courier can reach you.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            aria-live="polite"
            className="text-xs font-medium text-amber-600">
            {" "}
            {isChanged && !saving ? "You have unsaved changes" : ""}
          </span>

          <div className="flex items-center gap-2">
            <Link
              to="/user/address"
              className="inline-flex h-10 items-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700
               no-underline transition-colors hover:bg-gray-50">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!isComplete || !isChanged || saving}
              className="h-10 rounded-lg bg-sky-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-600
              disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500">
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserEditAddress;
