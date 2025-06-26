"use client";

import dynamic from "next/dynamic";

const Slider = dynamic(() => import("react-slick"), { ssr: false });
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TestimonialData } from "../types/testimonial.types";
import TestimonialCard from "./Testimonials/TestimonialCard";

interface ClientSliderProps {
  testimonials: TestimonialData[];
}

const CustomPrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button className="custom-arrow custom-prev-arrow" onClick={onClick}>
    <ChevronLeft size={24} />
  </button>
);

const CustomNextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button className="custom-arrow custom-next-arrow" onClick={onClick}>
    <ChevronRight size={24} />
  </button>
);

export default function ClientSlider({ testimonials }: ClientSliderProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    touchThreshold: 10,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true
        }
      }
    ]
  };

  return (
    <div className="testimonials-slider">
      <Slider {...settings}>
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="slider-item">
            <TestimonialCard {...testimonial} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
