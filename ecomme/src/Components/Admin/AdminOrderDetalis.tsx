/** @format */
import { useState } from "react";
import { IconStar, IconTrash } from "@tabler/icons-react";
import vacuum from "../../images/allProducts/vacuum.png";

const cardClass = "rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]";

const customer = [
  { label: "Name", value: "mohamed el aissaoui" },
  { label: "Phone", value: "+212667500649" },
  { label: "Email", value: "isawimed@gmail.com" },
];

const AdminOrderDetalis = () => {
  const [status, setStatus] = useState("");

  const handleSave = () => {
    // TODO: Call the API to update the order status.
    console.log("Save status:", status);
  };

  return (
    <div className="w-full">
      <div className="mb-4 text-lg font-bold text-gray-900 pt-3">
        {" "}
        Order Details #5777ae
      </div>

      {/* المنتج */}
      <div className={`${cardClass} p-3`}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex h-44 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:w-40">
            <img
              src={vacuum}
              alt="iPhone XR 128GB"
              className="max-h-[85%] max-w-[85%] object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs text-gray-500">Electronics</span>
              <button
                type="button"
                aria-label="Remove product"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500">
                <IconTrash size={17} />
              </button>
            </div>

            <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-gray-900">
              {" "}
              robot vacuum
            </h3>

            <div className="flex shrink-0 items-center gap-1 pt-0.5 pt-2">
              <IconStar size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-gray-600">4.5</span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-gray-500">Brand:</span>
              <span className="font-medium text-gray-900">Ammmm</span>
              <span
                className="ml-1 h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: "#E52C2C" }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <label htmlFor="quantity" className="text-gray-500">
                  {" "}
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  defaultValue={1}
                  className="h-8 w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 text-center text-sm text-gray-900 focus:border-sky-400 focus:outline-none 
                  focus:ring-2 focus:ring-sky-400/40"
                />
              </div>
              <span className="text-base font-bold text-gray-900">
                {" "}
                3,000 MAD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* بيانات العميل */}
      <div className={`${cardClass} mt-4 p-4`}>
        <div className="mb-3 border-b border-gray-100 pb-3 font-bold text-gray-900">
          {" "}
          Customer Details
        </div>

        <dl className="grid grid-cols-[6.5rem_1fr] gap-x-2 gap-y-2 text-sm">
          {customer.map((item) => (
            <div key={item.label} className="contents">
              <dt className="text-gray-500">{item.label}</dt>
              <dd className="min-w-0 break-words text-gray-900">
                {" "}
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-lg font-bold text-gray-900">3,000 $</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <label htmlFor="order-status" className="sr-only">
            {" "}
            Order status
          </label>
          <select
            id="order-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 focus:border-sky-400 focus:outline-none focus:ring-2
             focus:ring-sky-400/40">
            <option value="" disabled>
              {" "}
              Order Status
            </option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="button"
            onClick={handleSave}
            disabled={!status}
            className="h-10 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed 
            disabled:opacity-50 disabled:hover:bg-sky-500">
            {" "}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetalis;
