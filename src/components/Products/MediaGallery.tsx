import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductFile } from "@/types/product.types";

interface MediaGalleryProps {
  images: ProductFile[];
  productName: string;
}

export default function MediaGallery({
  images,
  productName
}: MediaGalleryProps) {
  const mainImage = images?.[0]?.url || "/default-product.jpg";

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <Image
          src={mainImage}
          key={mainImage}
          alt={productName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnail Grid */}
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={image.url}
                key={image.url}
                alt={`${productName} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
