import Image from "next/image";
import Link from "next/link";
import { MdReadMore } from "react-icons/md";
import Loader from "./common/Loader";
import Pagination from "./common/Pagination";

interface ServicesProps {
  businessData: any;
  services: any[];
  isHomepage?: boolean;
  currentPage?: number;
  totalPages?: number;
}

export default function Services({
  businessData,
  services,
  isHomepage = false,
  currentPage = 1,
  totalPages = 1
}: ServicesProps) {
  const staticData = isHomepage
    ? businessData?.staticData?.home?.services
    : businessData?.staticData?.services;

  const displayedServices = isHomepage ? services.slice(0, 3) : services;

  const truncateText = (text: string, maxLength: number) =>
    text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  if (!services) return <Loader />;

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="departments">
        <div className="departments-header">
          <h2 className="departments-heading">
            {staticData?.heading || "Our Services"}
          </h2>
          <p className="departments-subheading">
            {staticData?.subheading || "Explore our professional services"}
          </p>
        </div>

        {displayedServices.length > 0 ? (
          <>
            <div className="departments-grid">
              {displayedServices.map((service) => (
                <Link
                  key={service._id || service.sku}
                  href={`/service/${service.sku}`}
                  className="department-card"
                >
                  <div className="relative h-48">
                    <Image
                      src={
                        service?.media?.[0]?.url ||
                        "https://placehold.co/600.png?text=No+Image"
                      }
                      alt={service.title || "Service image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="content">
                    <h3>{truncateText(service?.title || service?.name, 30)}</h3>
                    <p>{truncateText(service?.description, 109)}</p>
                    <div className="read-more-text">
                      <span>Read More</span>
                      <MdReadMore className="text-xl" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {isHomepage && services.length > 3 && (
              <div className="text-center mt-12">
                {/* <Link
                  href="/services"
                  className="inline-block px-8 py-3 bg-[rgb(1,82,168)] text-white rounded-full hover:bg-[rgb(3,48,97)] transition-colors"
                >
                  View All Services
                </Link> */}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No services found. Please try again later.
            </p>
          </div>
        )}

        {!isHomepage && totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/services"
            />
          </div>
        )}
      </div>
    </section>
  );
}
