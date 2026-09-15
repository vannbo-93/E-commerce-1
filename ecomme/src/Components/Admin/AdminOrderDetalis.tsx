/** @format */
import { IconTrash } from "@tabler/icons-react";
import mobile from "../../images/mobile.png";

const AdminOrderDetalis = () => {
  return (
    <div className="w-full">
      <div className="admin-content-text mb-3 font-bold ">
        Order Details #5777ae
      </div>
      <div className="w-full my-2 px-2 gap-3 bg-[#1E1E2E] rounded-xl p-3 border border-gray-700/50">
        <div className="flex gap-3">
          <img
            width="160"
            height="197"
            src={mobile}
            alt=""
            className="rounded-lg object-cover"
          />
          <div className="w-full">
            <div className="flex flex-row justify-between">
              <div className="pt-2 text-sm text-gray-300">Electronics</div>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10
                 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                }}>
                <IconTrash size={16} />
              </button>
            </div>

            <div className="flex flex-row justify-start items-start gap-2 mt-2">
              <div className="text-sm font-semibold text-orange-400">
                iPhone XR with 128GB storage, 4G LTE support, and FaceTime
              </div>
              <div className="pt-1 text-sm text-yellow-400 whitespace-nowrap">
                {" "}
                4.5{" "}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="text-sm text-gray-400">Brand:</div>
              <div className="text-sm text-gray-200 font-medium">Apple</div>
              <div
                className="w-5 h-5 rounded-full border border-gray-500"
                style={{ backgroundColor: "#E52C2C" }}></div>
            </div>

            <div className="flex flex-row justify-between mt-2">
              <div className="flex items-center pt-2 gap-2">
                <div className="text-sm text-gray-400">Quantity</div>
                <input
                  type="number"
                  min="1"
                  defaultValue={1}
                  className="w-14 h-7 bg-[#2A2A3C] border border-gray-600 rounded-md px-2 text-white text-sm 
                  focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="pt-2 text-sm text-white font-semibold">
                {" "}
                3,000 MAD{" "}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-4 bg-[#1E1E2E] rounded-xl border border-gray-700/50 p-4 user-data">
        <div className="admin-content-text pb-3 border-b border-gray-700/50 mb-3 font-bold">
          {" "}
          Customer Details{" "}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div
              style={{ fontFamily: "Almarai" }}
              className="text-[#979797] text-sm w-24">
              {" "}
              name:{" "}
            </div>
            <div
              style={{ fontFamily: "Almarai" }}
              className="text-gray-200 text-sm">
              {" "}
              mohamed el aissaoui{" "}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              style={{ fontFamily: "Almarai" }}
              className="text-[#979797] text-sm w-24">
              {" "}
              Phone Number:{" "}
            </div>
            <div
              style={{ fontFamily: "Almarai" }}
              className="text-gray-200 text-sm">
              {" "}
              +212667500649{" "}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              style={{ fontFamily: "Almarai" }}
              className="text-[#979797] text-sm w-24">
              {" "}
              Email:{" "}
            </div>
            <div
              style={{ fontFamily: "Almarai" }}
              className="text-gray-200 text-sm">
              {" "}
              isawimed@gmail.com
            </div>
          </div>
        </div>

        <div className="mt-4 inline-block px-4 py-2 border border-gray-700/50 rounded-lg text-sm text-white">
          Total: 4,000 MAD{" "}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <select
            name="languages"
            id="lang"
            className="h-9 bg-[#2A2A3C] border border-gray-600 rounded-md px-3 text-sm text-white text-center flex-1 focus:outline-none focus:border-blue-400">
            <option value="val">Order Status</option>
            <option value="val2">In Progress</option>
            <option value="val3">Completed</option>
            <option value="val4">Cancelled</option>
          </select>
          <button className="h-9 px-4 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors">
            {" "}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetalis;
