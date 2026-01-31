"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { debugLog } from "@/utils/debug.util";

interface BannerProps {
  businessData: {
    business: {
      bannerUrl?: string;
      businessName?: string;
      staticData?: {
        home?: {
          banner?: {
            title?: string;
            subtitle?: string;
            buttonText?: string;
            bannerUrls?: any;
          };
        };
      };
      featuredImageUrl?: string;
    };
  };
}

export default function Banner({ businessData }: BannerProps) {
  debugLog("Banner", "Rendering with data", businessData);

  const bannerData = businessData?.business?.staticData?.home?.banner;
  const businessInfo = businessData?.business;

  // Default banner images array
  const defaultBannerImages = [
    ""
  ];

  // Use provided banner URL or default images
  const bannerImages = businessInfo?.staticData?.home?.banner?.bannerUrls?.length > 0 ?
    businessInfo?.staticData?.home?.banner?.bannerUrls
    : [businessInfo?.featuredImageUrl];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  // Track window width for responsive behavior
  const [windowWidth, setWindowWidth] = useState(0);
  const [showContent, setShowContent] = useState(false);
  // Track auto-play resume timeout to clean it up
  const [autoPlayTimeout, setAutoPlayTimeout] = useState<NodeJS.Timeout | null>(null);

  // Update window width on resize and initial load
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Automatically show content on desktop
  const isDesktop = windowWidth >= 768;
  const contentVisible = isDesktop || showContent;

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, bannerImages.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
    // Clear existing timeout before setting new one
    if (autoPlayTimeout) clearTimeout(autoPlayTimeout);
    // Resume auto-play after 10 seconds
    const timeout = setTimeout(() => setIsAutoPlaying(true), 10000);
    setAutoPlayTimeout(timeout);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    // Clear existing timeout before setting new one
    if (autoPlayTimeout) clearTimeout(autoPlayTimeout);
    // Resume auto-play after 10 seconds
    const timeout = setTimeout(() => setIsAutoPlaying(true), 10000);
    setAutoPlayTimeout(timeout);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentImageIndex(index);
    // Clear existing timeout before setting new one
    if (autoPlayTimeout) clearTimeout(autoPlayTimeout);
    // Resume auto-play after 10 seconds
    const timeout = setTimeout(() => setIsAutoPlaying(true), 10000);
    setAutoPlayTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeout) clearTimeout(autoPlayTimeout);
    };
  }, [autoPlayTimeout]);

  return (
    <div className="banner relative">
      {/* Image Container */}
      <div className="absolute inset-0 w-full h-full">
        {bannerImages.map((imageUrl, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={imageUrl || "https://placehold.co/600x400"}
              alt={`${businessInfo?.businessName || "Business"} Banner ${index + 1
                }`}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 
                   bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 
                   rounded-full transition-all duration-300 hover:scale-110 
                   focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 
                   bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 
                   rounded-full transition-all duration-300 hover:scale-110 
                   focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
        aria-label="Next image"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                      flex space-x-2 z-20"
      >
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 
                       focus:outline-none focus:ring-2 focus:ring-white/50 ${index === currentImageIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div
        className="absolute top-4 right-4 bg-black/50 text-white 
                      px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm z-20"
      >
        {currentImageIndex + 1} / {bannerImages.length}
      </div>

      {/* Content Overlay - Always visible on desktop, toggle on mobile */}
      <div className="banner-overlay">
        <div
          className={`banner-content ${contentVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <div className="banner-header">{businessInfo?.businessName}</div>

          <h1 className="banner-title">
            {bannerData?.title || "Welcome to our Business"}
          </h1>

          <p className="banner-subtitle">
            {bannerData?.subtitle || "Your trusted partner in success"}
          </p>

          <Link href="/appointment" className="banner-button-home">
            {bannerData?.buttonText || "Get Started"}
          </Link>
        </div>

        {/* Toggle button - ONLY visible on mobile */}
        {!isDesktop && (
          <button
            onClick={() => setShowContent(!showContent)}
            className="content-toggle-button"
            aria-label={showContent ? "Hide content" : "Show content"}
          >
            {showContent ? (
              <>
                <ChevronDown className="toggle-icon" />
                <span className="toggle-text">Hide Info</span>
              </>
            ) : (
              <>
                <ChevronUp className="toggle-icon" />
                <span className="toggle-text">View Business Info</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 left-4 z-20">
        <div
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${isAutoPlaying ? "bg-green-500" : "bg-red-500"
            }`}
          title={isAutoPlaying ? "Auto-play enabled" : "Auto-play paused"}
        />
      </div>
    </div>
  );
}
