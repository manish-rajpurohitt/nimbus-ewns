import Services from "@/components/Services";
import { fetchBusinessData } from "@/utils/api.utils";
import { api } from "@/lib/api";
import PageBanner from "@/components/PageBanner";
import { getPageMEtadata } from "@/utils/common.util";
import { Metadata } from "next";

async function getServices(pageNumber = 1, limit = 3) {
  try {
    const response = await api.business.getServices(pageNumber, limit);
    if (!response.isSuccess) {
      throw new Error("Failed to fetch services");
    }
    return {
      services: response.data.services,
      totalPages: response.data.pagination.totalPages
    };
  } catch (error) {
    console.error("Error in getServices:", error);
    return { services: [], totalPages: 1 };
  }
}

export default async function ServicesPage({
  searchParams
}:any) {
  try {
    const pageNumber = searchParams?.page ?? "1";
    const page = Math.max(1, parseInt(pageNumber));
    const limit = 3; // Increased limit for better pagination

    const [businessRes, servicesRes] = await Promise.allSettled([
      fetchBusinessData(),
      getServices(page, limit)
    ]);

    if (businessRes.status === "rejected") {
      throw new Error("Failed to fetch business data");
    }

    const businessData = businessRes.value;
    const servicesData =
      servicesRes.status === "fulfilled"
        ? servicesRes.value
        : { services: [], totalPages: 1 };

    if (!businessData?.isSuccess) {
      throw new Error("Invalid business data");
    }

    return (
      <>
        <PageBanner
          bannerImage="https://progatetechnology.com/public/assets/banner1.jpg"
          title="Our Services"
          currentPage="Services"
        />
        <Services
          businessData={businessData.data}
          services={servicesData.services}
          currentPage={page}
          totalPages={servicesData.totalPages}
          isHomepage={false}
        />
      </>
    );
  } catch (error) {
    console.error("ServicesPage", error);
    return <div>Error loading services</div>;
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  return getPageMEtadata(["services"]);
}