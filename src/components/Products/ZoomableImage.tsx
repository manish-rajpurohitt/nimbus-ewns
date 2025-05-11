"use client";
import { useState, useRef, MouseEvent } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  zoomScale?: number;
}

export default function ZoomableImage({
  src,
  alt,
  zoomScale = 2.5
}: ZoomableImageProps) {
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={imageRef}
        className="relative w-full h-full cursor-zoom-in overflow-hidden"
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Base Image */}
        <img src={src} alt={alt} className="w-full h-full object-contain" />

        {/* Zoomed Image */}
        {showZoom && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `url(${src}) no-repeat`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: `${zoomScale * 100}%`
            }}
          />
        )}
      </div>
    </div>
  );
}
