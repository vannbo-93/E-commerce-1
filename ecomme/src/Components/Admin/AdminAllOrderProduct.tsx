/** @format */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IconMinus,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import vacuum from "../../images/allProducts/vacuum.png";

const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors";

const stepBtn =
  "flex h-7 w-7 items-center justify-center text-gray-500 transition-colors hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500";

const AdminAllOrderProduct = () => {
  const [quantity, setQuantity] = useState(1);
  const unitPrice = 3000;

  return (
    <div className="w-full rounded-2xl bg-white p-3 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <div className="flex min-w-0 gap-3">
        <Link
          to="/admin/orders/23"
          className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 no-underline">
          <img
            src={vacuum}
            alt="robot vacuum"
            className="h-24 w-auto object-contain flex h-52 items-center justify-center overflow-hidden rounded-xl bg-slate-50"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs text-gray-600">Electronics</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Edit order"
                className={`${iconBtn} hover:bg-sky-50 hover:text-sky-600`}>
                <IconPencil size={17} />
              </button>
              <button
                type="button"
                aria-label="Remove order"
                className={`${iconBtn} hover:bg-red-50 hover:text-red-500`}>
                <IconTrash size={17} />
              </button>
            </div>
          </div>

          <h3 className="text-sm font-semibold leading-snug text-gray-900">
            robot vacuum
          </h3>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Brand:</span>
            <span className="font-medium text-gray-900">Ammmm</span>
            <span
              className="ml-1 h-4 w-4 rounded-full border border-gray-200"
              style={{ backgroundColor: "#060606" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-200">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className={stepBtn}>
            <IconMinus size={14} />
          </button>
          <span
            aria-live="polite"
            className="w-8 text-center text-sm font-medium text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className={stepBtn}>
            <IconPlus size={14} />
          </button>
        </div>

        <span className="text-base font-bold text-gray-900">
          {(unitPrice * quantity).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          $
        </span>
      </div>
    </div>
  );
};

export default AdminAllOrderProduct;
