import Image from "next/image";
import Link from "next/link";
import { debugLog } from "@/utils/debug.util";

interface BannerProps {
  businessData: {
    business: {
      bannerUrl?: string;
      businessName?: string;
    };
    staticData?: {
      home?: {
        banner?: {
          title?: string;
          subtitle?: string;
          buttonText?: string;
        };
      };
    };
  };
}

export default function Banner({ businessData }: BannerProps) {
  debugLog("Banner", "Rendering with data", businessData);

  const bannerData = businessData?.staticData?.home?.banner;
  const businessInfo = businessData?.business;

  const defaultBannerUrl =
    "https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg";
  const bannerUrl = businessInfo?.bannerUrl || defaultBannerUrl;

  return (
    <div className="banner">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={bannerUrl}
          key={bannerUrl}
          alt={businessInfo?.businessName || "Business Banner"}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          quality={85}
        />
      </div>

      <div className="banner-overlay">
        <div className="banner-content">
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
      </div>
    </div>
  );
}
