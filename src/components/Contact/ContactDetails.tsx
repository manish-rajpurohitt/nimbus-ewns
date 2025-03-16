import { MapPin, Phone, Mail } from "lucide-react";
import { getBusinessAdd } from "@/utils/common.util";
import type { Business, BusinessAddress } from "@/types/business.types";

interface ContactDetailsProps {
  business: Business;
  address: BusinessAddress;
  staticData?: any;
}

export default function ContactDetails({
  business,
  address,
  staticData
}: ContactDetailsProps) {
  const formattedAddress = getBusinessAdd(address);

  return (
    <section className="background-color-2">
      <div className="contact-detail-container">
        <h2 className="contact-detail-title">
          {staticData?.subheading || "Get in Touch"}
        </h2>
        <div className="contact-detail-content">
          <div className="contact-detail-info">
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <MapPin />
              </div>
              <div className="contact-detail-details">
                <h3 className="contact-detail-title">Address</h3>
                <p className="contact-detail-address">{formattedAddress}</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <Phone />
              </div>
              <div className="contact-detail-details">
                <h3 className="contact-detail-title">Call Us</h3>
                <p className="contact-detail-phone">
                  {business.countryCode}-{business.phone}
                </p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <Mail />
              </div>
              <div className="contact-detail-details">
                <h3 className="contact-detail-title">E-mail Us</h3>
                <p className="contact-detail-email">{business.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
