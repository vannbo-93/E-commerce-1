/** @format */

import { Link } from "react-router-dom";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import mobile from "../../images/mobile.png";

const AdminAllOrderProduct = () => {
  return (
    <div className="w-full rounded-2xl border border-gray-700/50 bg-[#1E1E2E] p-3">
      <div className="flex min-w-0 gap-3">
        <Link
          to="/admin/orders/23"
          className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#2A2A3C] no-underline">
          <img
            src={mobile}
            alt="iPhone XR"
            className="h-24 w-auto object-contain"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-start gap-1">
          <span className="text-xs font-bold text-gray-200">Electronics</span>
          <h3 className="mt-1 text-sm font-semibold leading-snug text-orange-400">
            iPhone XR 128GB Red
          </h3>

          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="text-gray-400">Brand:</span>
            <span className="font-medium text-gray-200">Apple</span>
            <span
              className="h-4 w-4 rounded-full border border-gray-500"
              style={{ backgroundColor: "#E52C2C" }}
            />
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="text-gray-400">Quantity</span>
            <input
              type="number"
              min="1"
              defaultValue={1}
              aria-label="Quantity"
              className="h-7 w-14 rounded-md border border-gray-600 bg-[#2A2A3C] px-2 text-sm text-white focus:border-orange-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-white">
          <span className="font-bold">3,000</span>{" "}
          <span className="text-xs font-bold text-gray-400">MAD</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Remove order"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition-colors hover:bg-red-500 hover:text-white">
            <IconTrash size={16} className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Edit order"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 transition-colors hover:bg-blue-500 hover:text-white">
            <IconPencil size={16} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAllOrderProduct;
