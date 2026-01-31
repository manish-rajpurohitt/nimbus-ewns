import ServiceDetails from "@/components/ServiceDetails";
import { fetchBusinessData } from "@/utils/api.utils";
import { api } from "@/lib/api";
import { getPageMEtadata } from "@/utils/common.util";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

async function getServiceDetails(id: string) {
  try {
    const response = await api.business.getServiceDetails(id);
    if (!response.isSuccess) {
      throw new Error("Failed to fetch service details");
    }
    return response.data;
  } catch (error) {
    console.error("Error in getServiceDetails:", error);
    return null;
  }
}

export default async function ServicePage({
  params
}:any) {
  try {
    const { id } = await params;
    const [businessRes, serviceData] :any = await Promise.all([
      fetchBusinessData(),
      getServiceDetails(id)
    ]);

    if (!serviceData || !businessRes?.data) {
      notFound();
    }

    return (
      <ServiceDetails
        businessData={businessRes.data}
        serviceData={serviceData}
      />
    );
  } catch (error) {
    console.error("Error loading service:", error);
    notFound();
  }
}


export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  // console.log("🚀 Running generateMetadata for:", params);

  try {
    const { id } = await params;
    const headerList = await headers();
    const protocol = headerList.get("x-forwarded-proto") || "https";
    const host = headerList.get("host") || "example.com";
    const fullUrl = `${protocol}://${host}/service/${id}`;
    // console.log(params)
    // const fullUrl = `https://icontechpro.com/service/${params.id}`;

    return await getPageMEtadata(fullUrl);
  } catch (error) {
    console.error("⚠️ Metadata Error:", error);
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}