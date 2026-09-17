/** @format */

import { IconTrash, IconPencil } from "@tabler/icons-react";

const UserAddressCard = () => {
  return (
    <div className="bg-[#1E1E2E] border border-gray-700/50 rounded-2xl p-3 w-full">
      <div className="flex-1 flex flex-col justify-start gap-1 min-w-0">
        <div className="flex justify-between">
          <div className="p-1 text-gray-200 font-medium">House</div>

          <div className="flex p-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Edit order"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 
                text-blue-400 transition-colors hover:bg-blue-500 hover:text-white">
                <IconPencil size={16} className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Remove order"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-400 
                transition-colors hover:bg-red-500 hover:text-white">
                <IconTrash size={16} className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div className=" text-sm font-semibold text-orange-400 leading-snug mt-1">
            Al Amal 350 knetra morocco
          </div>
        </div>
        <div className="mt-3 flex">
          <div className="text-gray-400">Number Phone :</div>
          <div className="text-gray-200 font-medium">+212667500649</div>
        </div>
      </div>
    </div>
  );
};
export default UserAddressCard;
