/** @format */
import type { SlideEvent } from "react-image-gallery";
import { IconChevronRight } from "@tabler/icons-react";

interface RightButtonProps {
  onClick: (event?: SlideEvent) => void;
  disabled?: boolean;
}

const RightButton = ({ onClick, disabled = false }: RightButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Next image"
      className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center 
      justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors 
      hover:bg-white hover:text-sky-600 disabled:pointer-events-none disabled:opacity-40">
      <IconChevronRight size={20} />
    </button>
  );
};

export default RightButton;
