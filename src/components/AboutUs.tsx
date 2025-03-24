import Image from "next/image";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

interface AboutUsProps {
  businessData: {
    business: {
      shortBio?: string;
      featuredUrl?: string;
      description?: string;
      businessName?: string;
      staticData?: {
        home?: {
          aboutUs?: {
            title?: string;
            heading?: string;
            buttonText?: string;
            image?: string;
            bulletPoints?: string[];
          };
        };
      };
    };
  };
}

export default function AboutUs({ businessData }: AboutUsProps) {
  const aboutUs = businessData?.business?.staticData?.home?.aboutUs;
  const businessInfo = businessData?.business;
  const bioText = businessInfo?.shortBio || businessInfo?.description || "";
  const cleanBioText = bioText.replace(/<[^>]*>/g, "");
  const bulletPoints = aboutUs?.bulletPoints || [];

  const imageUrl =
    businessInfo?.featuredUrl ||
    aboutUs?.image ||
    "https://placehold.co/600x400?text=Professional+Business";

  return (
    <section className="about-section-main visible">
      <div className="about-main-container">
        <div className="about-content">
          <div className="about-text">
            <h4>{aboutUs?.title || "ABOUT US"}</h4>
            {/* <h2>{businessInfo?.businessName || "Our Business"}</h2> */}
            <div className="subheading">
              {aboutUs?.heading || "Professional Solutions"}
            </div>

            <div className="text-content-wrapper">
              <input
                type="checkbox"
                id="read-more-check"
                className="read-more-toggle"
              />
              <div className="about-text-p">
                <div className="text-content">{cleanBioText}</div>
                <label htmlFor="read-more-check" className="read-more-btn">
                  <span className="read-more-text">Read More</span>
                  <FaChevronDown className="read-more-icon" />
                </label>
              </div>
            </div>

            {/* {bulletPoints.length > 0 && (
              <div className="features-wrapper">
                <input
                  type="checkbox"
                  id="features-toggle"
                  className="features-toggle"
                />
                <div className="features-container">
                  <div className="features-grid-about">
                    {bulletPoints.map((point, index) => (
                      <div key={index} className="feature-item">
                        <span className="feature-text">{point}</span>
                      </div>
                    ))}
                  </div>
                  {bulletPoints.length > 2 && (
                    <label htmlFor="features-toggle" className="view-more-btn">
                      View All Features
                    </label>
                  )}
                </div>
              </div>
            )} */}

            <Link href="/about" className="know-more-btn">
              {aboutUs?.buttonText || "Learn More About Us"}
            </Link>
          </div>
        </div>

        <div className="about-image">
          <Image
            src={imageUrl}
            key={imageUrl}
            alt={`About ${businessInfo?.businessName || "Our Business"}`}
            fill
            className="main-image"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  );
}
