/** @format */

import next from "../../images/next.png";

import type { SlideEvent } from "react-image-gallery";

interface LeftButtonProps {
  onClick: (event?: SlideEvent) => void;
  disabled?: boolean;
}

const LeftButton = ({ onClick, disabled = false }: LeftButtonProps) => {
  console.log("Left button loaded!");
  const handleClick = (event?: React.MouseEvent<HTMLImageElement>) => {
    if (!disabled) {
      onClick(event);
    }
  };

  return (
    <img
      src={next}
      alt="Previous"
      width={35}
      height={35}
      onClick={handleClick}
      className={`float-left mt-[220px] cursor-pointer ${
        disabled ? "opacity-40 pointer-events-none" : ""
      }`}
    />
  );
};

export default LeftButton;
