import Services from "@/components/Services";
import { fetchBusinessData } from "@/utils/api.utils";
import { api, getMetaTagsOfPage } from "@/lib/api";
import PageBanner from "@/components/PageBanner";
import { getPageMEtadata } from "@/utils/common.util";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata({
  params
}: {
  params: any;
}): Promise<Metadata> {
  console.log("🚀 Running generateMetadata for:", params);

  try {
    const headerList = await headers();
    const protocol = headerList.get("x-forwarded-proto") || "https";
    const host = headerList.get("host") || "example.com";
    const fullUrl = `${protocol}://${host}/services`;

    return await getPageMEtadata(fullUrl);
  } catch (error) {
    console.error("⚠️ Metadata Error:", error);
    return {
      title: "Default Title",
      description: "Default Description"
    };
  }
}

export default async function ServicesPage({ searchParams }: any) {
  try {
    const pageNumber = searchParams?.page ?? "1";
    const page = Math.max(1, parseInt(pageNumber));
    const limit = 6;

    // Fetch all services in one request
    const [businessRes, allServicesRes] = await Promise.all([
      fetchBusinessData(),
      api.business.getAllServices()
    ]);

    if (!businessRes?.isSuccess || !allServicesRes?.isSuccess) {
      throw new Error("Failed to fetch data");
    }

    const allServices = allServicesRes.data.services || [];

    // Sort services by createdAt (newest first)
    const sortedServices = allServices.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate services
    const startIndex = (page - 1) * limit;
    const paginatedServices = sortedServices.slice(
      startIndex,
      startIndex + limit
    );
    const totalPages = Math.ceil(allServices.length / limit);

    return (
      <>
        <PageBanner
          bannerImage="https://progatetechnology.com/public/assets/banner1.jpg"
          title="Our Services"
          currentPage="Services"
        />
        <Services
          businessData={businessRes.data}
          services={paginatedServices}
          currentPage={page}
          totalPages={totalPages}
          isHomepage={false}
        />
      </>
    );
  } catch (error) {
    console.error("ServicesPage", error);
    return <div>Error loading services</div>;
  }
}
