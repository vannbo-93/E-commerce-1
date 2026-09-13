/** @format */

import { useCallback } from "react";
import mobile from "../../images/mobile.png";
import mobile1 from "../../images/mobile1.png";
import mobile2 from "../../images/mobile2.png";
import "react-image-gallery/styles/image-gallery.css";
import ImageGallery, {
  type GalleryItem,
  type SlideEvent,
} from "react-image-gallery";
import LeftButton from "./LeftButton";
import RightButton from "./RightButton";

const GALLERY_IMAGES: GalleryItem[] = [
  { original: mobile },
  { original: mobile1 },
  { original: mobile2 },
  { original: mobile },
];

const ProductGallery = () => {
  const renderRightNav = useCallback(
    (onClick: (event?: SlideEvent) => void, disabled?: boolean) => (
      <RightButton onClick={onClick} disabled={disabled} />
    ),
    [],
  );

  const renderLeftNav = useCallback(
    (onClick: (event?: SlideEvent) => void, disabled?: boolean) => (
      <LeftButton onClick={onClick} disabled={disabled} />
    ),
    [],
  );

  return (
    <div className="w-full pt-2">
      <ImageGallery
        items={GALLERY_IMAGES}
        showThumbnails={false}
        showPlayButton={false}
        renderRightNav={renderRightNav}
        renderLeftNav={renderLeftNav}
        showFullscreenButton={false}
      />
    </div>
  );
};

export default ProductGallery;
