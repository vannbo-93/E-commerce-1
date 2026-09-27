/** @format */

import { useCallback } from "react";
import "react-image-gallery/styles/image-gallery.css";
import ImageGallery, {
  type GalleryItem,
  type SlideEvent,
} from "react-image-gallery";
import LeftButton from "./LeftButton";
import RightButton from "./RightButton";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

const ProductGallery = ({ images, title }: ProductGalleryProps) => {
  const galleryImages: GalleryItem[] = images.map((src) => ({
    original: src,
    originalAlt: title,
  }));

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
      <ImageGallery
        items={galleryImages}
        showThumbnails={galleryImages.length > 1}
        showPlayButton={false}
        showNav={galleryImages.length > 1}
        renderRightNav={renderRightNav}
        renderLeftNav={renderLeftNav}
        showFullscreenButton={false}
      />
    </div>
  );
};
export default ProductGallery;
