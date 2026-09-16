/** @format */

import mobile from "../../images/mobile.png";
import StarIcon from "@mui/icons-material/Star";


const UserAllOrderCard = () => {
  return (
    <div className="flex gap-3 mb-2">
      <img width="93" height="120" src={mobile} alt=""
        className="flex-shrink-0 object-cover rounded-md"
      />

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-orange-400 leading-snug mt-1">
          iPhone XR with 128GB storage, supports 4G LTE, and includes FaceTime
          app (Product) in red
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="pt-2 flex items-center gap-1 text-amber-400 font-bold">
            <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />4.5</div>
          <div className="rate-count p-1 pt-2">(160 reviews)</div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="cat-text ">Quantity</div>
          <input type="number"  readOnly  defaultValue={1}
            style={{ width: "40px", height: "25px" }}
            className="mx-2 bg-gray-300  border border-gray-600 rounded-md px-2 text-black 
            text-sm focus:outline-none focus:border-blue-400"/>
        </div>
      </div>
    </div>
  );
};

export default UserAllOrderCard;
