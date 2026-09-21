/** @format */
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const baseField =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40";
//  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400
// focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40";

const UserAddAddress = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ label: "", details: "", phone: "" });

  const canSubmit =
    form.label.trim() !== "" &&
    form.details.trim() !== "" &&
    form.phone.trim() !== "";

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: call API to save the address, then navigate only on success.
    console.log(form);
    navigate("/user/address");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4 text-lg font-bold text-gray-900">
        Add New Address
      </div>

      <div className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="address-label"
            className="text-sm font-medium text-gray-700">
            {" "}
            Address label
          </label>
          <input
            id="address-label"
            type="text"
            name="label"
            value={form.label}
            onChange={handleChange}
            placeholder="For example: Home, Work"
            required
            className={`h-10 ${baseField}`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="address-details"
            className="text-sm font-medium text-gray-700">
            {" "}
            Address details
          </label>
          <textarea
            id="address-details"
            name="details"
            value={form.details}
            onChange={handleChange}
            rows={4}
            placeholder="Street, neighborhood, city"
            required
            className={`resize-none py-2 ${baseField}`}
          />
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
            required
            className={`h-10 ${baseField}`}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-10 rounded-lg bg-sky-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-600
             disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-500">
            Add address
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserAddAddress;
