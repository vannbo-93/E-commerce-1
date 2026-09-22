/** @format */
import type { SlideEvent } from "react-image-gallery";
import { IconChevronLeft } from "@tabler/icons-react";

interface LeftButtonProps {
  onClick: (event?: SlideEvent) => void;
  disabled?: boolean;
}

const LeftButton = ({ onClick, disabled = false }: LeftButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Previous image"
      className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center 
      justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors 
      hover:bg-white hover:text-sky-600 disabled:pointer-events-none disabled:opacity-40">
      <IconChevronLeft size={20} />
    </button>
  );
};

export default LeftButton;
