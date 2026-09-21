/** @format */

import { IconTrash, IconPencil } from "@tabler/icons-react";

interface UserAddressCardProps { label?: string; address?: string; phone?: string;}

const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors";

const UserAddressCard = ({ label = "House", address = "Al Amal 350 knetra morocco", phone = "+212667500649",
}: UserAddressCardProps) => {
  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
          {label}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Edit address"
            className={`${iconBtn} hover:bg-sky-50 hover:text-sky-600`}>
            <IconPencil size={17} />
          </button>
          <button
            type="button"
            aria-label="Remove address"
            className={`${iconBtn} hover:bg-red-50 hover:text-red-500`}>
            <IconTrash size={17} />
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm font-semibold leading-snug text-gray-900">
        {address}
      </p>

      <p className="mt-2 flex items-center gap-2 text-sm">
        <span className="text-gray-500">Phone:</span>
        <span className="font-medium text-gray-900">{phone}</span>
      </p>
    </div>
  );
};

export default UserAddressCard;
