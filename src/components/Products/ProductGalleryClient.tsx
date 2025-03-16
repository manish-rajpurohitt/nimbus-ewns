"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductFile } from "@/types/product.types";

interface ProductGalleryClientProps {
  images: ProductFile[];
  productName: string;
}

export default function ProductGalleryClient({
  images,
  productName
}: ProductGalleryClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const mainImage = images?.[currentIndex]?.url || "/default-product.jpg";

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailsRef.current) {
      const scrollAmount = 120;
      thumbnailsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="gallery">
      <div className="gallery__main">
        <div className="gallery__image-wrapper">
          <Image
            src={mainImage}
            alt={productName}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 80vw, 700px"
            priority
            className="gallery__image"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="gallery__nav gallery__nav--prev"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="gallery__nav gallery__nav--next"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="gallery__thumbs">
          <button
            onClick={() => scrollThumbnails("left")}
            className="gallery__thumb-nav gallery__thumb-nav--prev"
            aria-label="Scroll thumbnails left"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="gallery__thumb-scroll" ref={thumbnailsRef}>
            {images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`gallery__thumb ${
                  currentIndex === idx ? "gallery__thumb--active" : ""
                }`}
              >
                <div className="gallery__thumb-wrapper">
                  <Image
                    src={image.url}
                    alt={`${productName} - ${idx + 1}`}
                    fill
                    sizes="100px"
                    className="gallery__thumb-image"
                  />
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollThumbnails("right")}
            className="gallery__thumb-nav gallery__thumb-nav--next"
            aria-label="Scroll thumbnails right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
