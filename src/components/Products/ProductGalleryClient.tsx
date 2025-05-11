"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ZoomableImage from "./ZoomableImage";

interface ProductGalleryClientProps {
  images: Array<{ url: string }>;
  productName: string;
}

export default function ProductGalleryClient({
  images,
  productName
}: ProductGalleryClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const visibleThumbnails = 4;

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleScrollLeft = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleScrollRight = () => {
    setStartIndex((prev) =>
      Math.min(images.length - visibleThumbnails, prev + 1)
    );
  };

  const visibleImages = images.slice(
    startIndex,
    startIndex + visibleThumbnails
  );

  return (
    <div className="product-gallery">
      {/* Main Image with Zoom */}
      <div className="main-image-container relative h-[400px]">
        <ZoomableImage
          src={images[selectedImage]?.url || ""}
          alt={`${productName} - Image ${selectedImage + 1}`}
        />

        {/* Image Counter */}
        <div className="image-counter">
          {selectedImage + 1} / {images.length}
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip with Navigation */}
      <div className="relative mt-2">
        <div className="thumbnails-container flex justify-center">
          {visibleImages.map((image, index) => {
            const actualIndex = startIndex + index;
            return (
              <button
                key={actualIndex}
                className={`thumbnail-item ${
                  selectedImage === actualIndex
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedImage(actualIndex)}
              >
                <img
                  src={image.url}
                  alt={`${productName} thumbnail ${actualIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            );
          })}
        </div>

        {/* Thumbnail Navigation Buttons */}
        {images.length > visibleThumbnails && (
          <>
            <button
              onClick={handleScrollLeft}
              disabled={startIndex === 0}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 p-1 rounded-full shadow-lg transition-all ${
                startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous thumbnails"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleScrollRight}
              disabled={startIndex >= images.length - visibleThumbnails}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 p-1 rounded-full shadow-lg transition-all ${
                startIndex >= images.length - visibleThumbnails
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              aria-label="Next thumbnails"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
