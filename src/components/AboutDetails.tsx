import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { debugLog } from "@/utils/debug.util";

interface AboutUsProps {
  businessData: {
    business: {
      featuredUrl?: string;
      description?: string;
      staticData?: {
        aboutUs?: {
          title?: string;
          shortDescriptionTitle?: string;
          longDescriptionTitle?: string;
          bulletPoints?: Array<{
            _id: string;
            title: string;
            subTitle: string;
            description: string;
            points: string[];
          }>;
        };
      };
    };
  };
}

export default function AboutDetails({ businessData }: AboutUsProps) {
  debugLog("AboutDetails", "Rendering with data", businessData);

  const aboutUs = businessData?.business?.staticData?.aboutUs;
  const businessInfo = businessData?.business;

  const sanitizedHtml = businessInfo?.description
    ? DOMPurify.sanitize(businessInfo.description)
    : "";

  return (
    <div className="about-us-container">
      {/* Header Section */}
      <div className="main-section-header">
        <h2 className="section-subtitle">{aboutUs?.title || "About Us"}</h2>
        <p className="subheading">
          {aboutUs?.shortDescriptionTitle || "Our Story"}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="about-us-content-grid">
        {/* Features Section */}
        <div className="about-us-features-container">
          {aboutUs?.bulletPoints?.map((point, index) => (
            <div
              key={point._id}
              className="about-us-feature-card"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeInUp 0.5s ease forwards"
              }}
            >
              <div className="about-us-feature-card-header">
                <h2>{point.title}</h2>
                <p className="about-us-subtitle">{point.subTitle}</p>
              </div>
              <div className="about-us-feature-card-content">
                <p className="about-us-description">{point.description}</p>
                <ul className="about-us-feature-list">
                  {point.points.map((item, index) => (
                    <li key={index} className="about-us-feature-item">
                      <BsFillPatchCheckFill className="about-us-check-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Image Section */}
        <div className="about-us-image-section">
          <div className="about-us-image-wrapper">
            <Image
              src={
                businessInfo?.featuredUrl ||
                "https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg"
              }
              key={
                businessInfo?.featuredUrl ||
                "https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg"
              }
              alt="About Us Hero"
              width={600}
              height={400}
              className="object-cover"
              priority
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="about-us-description-card">
        <div className="about-us-description-header">
          <h2>{aboutUs?.longDescriptionTitle || "About Us"}</h2>
          <p className="about-us-tagline">Discover our story and mission</p>
        </div>
        <div className="about-us-description-content">
          <div
            className="about-us-rich-text"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </div>
      </div>
    </div>
  );
}
