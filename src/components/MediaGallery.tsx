"use client";

import { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
  url: string;
  type: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
  title?: string;
}

const CustomArrow = ({
  direction,
  onClick
}: {
  direction: "prev" | "next";
  onClick?: () => void;
}) => (
  <button
    className={`custom-arrow custom-${direction}-arrow`}
    onClick={onClick}
    aria-label={`${direction} slide`}
  >
    {direction === "prev" ? (
      <ChevronLeft size={24} />
    ) : (
      <ChevronRight size={24} />
    )}
  </button>
);

export default function MediaGallery({ media, title }: MediaGalleryProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    className: "service-media-slider",
    rows: 1,
    slidesPerRow: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  };

  return (
    <div className="service-media">
      {title && <h2 className="service-media__title">{title}</h2>}
      <div className="service-media__container">
        <Slider {...settings}>
          {media.map((item, index) => (
            <div key={index} className="service-media__slide">
              <div className="service-media__wrapper">
                {item.type === "video" ? (
                  <video
                    controls
                    className="service-media__video"
                    src={item.url}
                  />
                ) : (
                  <div className="service-media__image-container">
                    <Image
                      src={item.url}
                      key={item.url}
                      alt={`Media ${index + 1}`}
                      fill
                      className="service-media__image"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="service-media__number">{index + 1}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
