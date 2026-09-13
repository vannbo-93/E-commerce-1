/** @format */

import type { SlideEvent } from "react-image-gallery";
import prev from "../../images/prev.png";

interface RightButtonProps {
  onClick: (event?: SlideEvent) => void;
  disabled?: boolean;
}

const RightButton = ({ onClick, disabled = false }: RightButtonProps) => {
    console.log("RightButton تم تحميله!");
  const handleClick = (event?: React.MouseEvent<HTMLImageElement>) => {
    if (!disabled) {
      onClick(event);
    }
  };

  return (
    <img
      src={prev}
      alt="التالي"
      width={35}
      height={35}
      onClick={handleClick}
      className={`float-right mt-[220px] cursor-pointer ${
        disabled ? "opacity-40 pointer-events-none" : ""
      }`}
    />
  );
};

export default RightButton;
