import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { FaSpinner } from "react-icons/fa";
import MediaGallery from "./MediaGallery";

interface ServiceDetailsProps {
  serviceData: any;
  businessData: any;
}

export default function ServiceDetails({
  serviceData,
  businessData
}: ServiceDetailsProps) {
  if (!serviceData) {
    return (
      <div className="details__loading">
        <FaSpinner className="details__loading-spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  const uniqueMedia = serviceData?.media?.reduce((acc: any[], curr: any) => {
    const exists = acc.find((item: any) => item.url === curr.url);
    if (!exists) acc.push(curr);
    return acc;
  }, []);

  return (
    <div className="details">
      <div className="details__banner main-page-container">
        {uniqueMedia && uniqueMedia.length > 0 && (
          <div className="details__banner-single">
            <Image
              src={uniqueMedia[0].url || "https://placehold.co/600.png"}
              alt={serviceData?.title || "Service banner"}
              fill
              className="details__banner-image"
              priority
            />
          </div>
        )}

        <div className="details__banner-overlay">
          <div className="details__intro">
            {serviceData?.media?.[0]?.url && (
              <Image
                src={serviceData.media[0].url}
                alt={serviceData?.title}
                width={80}
                height={80}
                className="details__department-icon"
              />
            )}
            <div className="details__title-wrapper">
              <h2 className="details__title">{serviceData?.title}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="details__content">
        <section className="details__description">
          <div className="details__description-content">
            <h1 className="details__subtitle">{serviceData?.subTitle}</h1>
            <div
              className="details__text"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(serviceData?.description)
              }}
            />
            <div className="details__service-info">
              {serviceData?.duration && (
                <div className="details__info-item">
                  <h3 className="details__info-label">Service Duration:</h3>
                  <p className="details__info-value">{serviceData.duration}</p>
                </div>
              )}
              {serviceData?.price?.amount && (
                <div className="details__info-item">
                  <h3 className="details__info-label">Service Cost:</h3>
                  <p className="details__info-value">
                    {`${serviceData.price.amount} ${serviceData.price.currency}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {uniqueMedia && uniqueMedia.length > 1 && (
            <div className="details__media">
              <h2 className="details__media-title">Service Media</h2>
              <div className="details__media-grid">
                <MediaGallery media={uniqueMedia} />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
