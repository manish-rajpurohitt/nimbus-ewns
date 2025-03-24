import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { getBusinessAdd } from "@/utils/common.util";
import { getActiveRoute } from "@/utils/path.util";
import { debugLog } from "@/utils/debug.util";
import type { Business, BusinessAddress } from "@/types/business.types";

interface FooterProps {
  businessData?: Business | null;
  businessAddress?: BusinessAddress | null;
  staticData?: {
    footer?: {
      backgroundImage?: string;
      subscription?: {
        title?: string;
        description?: string;
        buttonText?: string;
      };
    };
  } | null;
}

const defaultNavLinks = {
  main: [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Services", path: "/services" },
    { title: "Products", path: "/products" },
    { title: "Contact", path: "/contact-us" }
  ],
  resources: [
    { title: "Book Appointment", path: "/appointment" },
    { title: "Blog", path: "/blogs" },
    { title: "Albums", path: "/albums" },
    { title: "Teams", path: "/teams" }
  ]
};

export default function Footer({
  businessData,
  businessAddress,
  staticData,
  pathname
}: FooterProps & { pathname: string }) {
  if (!businessData) return null;

  const year = new Date().getFullYear();
  const address = businessAddress ? getBusinessAdd(businessAddress) : "";
  const subscriptionData = staticData?.footer?.subscription;
  const footerImage =
    staticData?.footer?.backgroundImage || "/default-footer.jpg";

  function getMapUrl(): string | undefined {
    if (!businessAddress) return undefined;
    const { addressLine1, city, state, country } = businessAddress;
    const query = `${addressLine1}, ${city}, ${state}, ${country}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
  }

  const renderLink = (link: { title: string; path: string }) => {
    const isActive = getActiveRoute(pathname, link.path);

    return (
      <li key={link.path}>
        <Link
          href={link.path}
          className={`transition-colors duration-200 ${
            isActive
              ? "text-[var(--primary-color)] font-medium border-b-2 border-[var(--primary-color)]"
              : "text-[var(--text-color)] hover:text-[var(--primary-color)]"
          }`}
        >
          {link.title}
        </Link>
      </li>
    );
  };

  return (
    <footer className="relative text-gray-900 pt-16 pb-8 overflow-hidden">
      {/* Background Image with no overlay */}
      {footerImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${footerImage})` }}
        />
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            {businessData?.logoURl && (
              <div>
                <Image
                  src={businessData.logoURl}
                  key={businessData.logoURl}
                  alt={businessData.businessName || "Business Logo"}
                  width={192}
                  height={48}
                  className="logo-footer"
                  priority
                />
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-4">
              {businessData?.phone && (
                <a
                  href={`tel:${businessData.phone}`}
                  className="flex items-center space-x-3 text-[var(--text-color)] hover:text-[var(--primary-color)] transition-colors p-2 rounded "
                >
                  <Phone className="h-5 w-5 text-[var(--primary-color)]" />
                  <span className="font-medium">
                    {businessData.countryCode}-{businessData.phone}
                  </span>
                </a>
              )}

              {businessData?.email && (
                <a
                  href={`mailto:${businessData.email}`}
                  className="flex items-center space-x-3 text-[var(--text-color)] hover:text-[var(--primary-color)] transition-colors p-2 rounded "
                >
                  <Mail className="h-5 w-5 text-[var(--primary-color)]" />
                  <span className="font-medium">{businessData.email}</span>
                </a>
              )}

              {address && (
                <a
                  href={getMapUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 text-[var(--text-color)] hover:text-[var(--primary-color)] transition-colors p-2 rounded "
                >
                  <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-[var(--primary-color)]" />
                  <span className="font-medium">{address}</span>
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 rounded ">
            <h3 className="text-lg font-semibold mb-6 text-[var(--primary-color)]">
              Main Navigation
            </h3>
            <ul className="space-y-3">
              {defaultNavLinks.main.map(renderLink)}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="p-4 rounded ">
            <h3 className="text-lg font-semibold mb-6 text-[var(--primary-color)]">
              Resources
            </h3>
            <ul className="space-y-3">
              {defaultNavLinks.resources.map(renderLink)}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="p-4 rounded ">
            <h3 className="text-lg font-semibold mb-6 text-[var(--primary-color)]">
              {subscriptionData?.title || "Stay Updated"}
            </h3>
            <p className="text-[var(--text-color)] mb-4">
              {subscriptionData?.description ||
                "Subscribe to our newsletter for updates"}
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2  border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--primary-color)] text-[var(--text-color)]"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] rounded-md transition-colors text-[var(--text-white-color)] font-medium"
              >
                {subscriptionData?.buttonText || "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[var(--border-color)] pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[var(--text-color)] font-medium p-2 rounded ">
              © {year} {businessData?.businessName}. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4  p-2 rounded-full">
              {businessData?.externalLinks?.map((link: any) => (
                <a
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-color)] hover:text-[var(--primary-color)] transition-colors"
                >
                  {link.logo ? (
                    <div className="w-5 h-5 relative">
                      <Image
                        key={link.logo}
                        src={link.logo}
                        alt={`${link.platform} social link`}
                        width={20}
                        height={20}
                        className="object-contain"
                        sizes="20px"
                        quality={90}
                      />
                    </div>
                  ) : (
                    <span className="font-medium">{link.platform}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
