import { fetchBusinessData } from "@/utils/api.utils";
import AboutDetails from "@/components/AboutDetails";
import Appointment from "@/components/Appointment";
import PageBanner from "@/components/PageBanner";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";
import { getPageMEtadata } from "@/utils/common.util";

export default async function AboutPage() {
  try {
    const businessRes = await fetchBusinessData();

    if (!businessRes?.isSuccess) {
      throw new Error("Failed to fetch business data");
    }

    const bannerImage =
      businessRes.data?.staticData?.pageBanners?.find(
        (banner: any) => banner.type === "about"
      )?.image ||
      "https://www.evyavancapital.com/wp-content/uploads/2019/10/about-sec-inner-banner-neww.jpg";

    return (
      <div>
        <PageBanner
          bannerImage={bannerImage}
          title="About Us"
          currentPage="About Us"
        />
        {/* Content Sections */}
        <AboutDetails businessData={businessRes.data} />
        <Appointment businessData={businessRes.data} />
      </div>
    );
  } catch (error) {
    console.error("Error in AboutPage:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: { params: any; }): Promise<Metadata> {
  console.log("🚀 Running generateMetadata for:", params);

  try {

    const headerList = await headers();
    const protocol = headerList.get("x-forwarded-proto") || "https";
    const host = headerList.get("host") || "example.com";
    // const fullUrl = `${protocol}://${host}/services/`;
    const fullUrl = `https://icontechpro.com/about`;

    return await getPageMEtadata(fullUrl);
  } catch (error) {
    console.error("⚠️ Metadata Error:", error);
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}