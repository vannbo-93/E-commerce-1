/** @format */

import { useCallback } from "react";
import smartphone from "../../images/allProducts/smartphone.png";
import "react-image-gallery/styles/image-gallery.css";
import ImageGallery, { type GalleryItem, type SlideEvent,} from "react-image-gallery";
import LeftButton from "./LeftButton";
import RightButton from "./RightButton";

const GALLERY_IMAGES: GalleryItem[] = [ { original: smartphone }, { original: smartphone },
  { original: smartphone }, { original: smartphone },];

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
    <div className="product-gallery w-full pt-2">
      {/* يكبّر صورة المعرض؛ react-image-gallery لا يوفر prop مباشرة لحجم الصورة */}
      <style>{`
        .product-gallery .image-gallery-slide .image-gallery-image {
          height: 500px;
          width: 100%;
          object-fit: contain;
          background-color: #f8fafc;
          border-radius: 1rem;
        }
        @media (max-width: 640px) {
          .product-gallery .image-gallery-slide .image-gallery-image {
            height: 320px;
          }
        }
      `}</style>
      <ImageGallery items={GALLERY_IMAGES} showThumbnails={false} showPlayButton={false}
        renderRightNav={renderRightNav} renderLeftNav={renderLeftNav} showFullscreenButton={false}
      />
    </div>
  );
};
export default ProductGallery;
