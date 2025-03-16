import { fetchBusinessData } from "@/utils/api.utils";
import AboutDetails from "@/components/AboutDetails";
import Appointment from "@/components/Appointment";
import PageBanner from "@/components/PageBanner";
import { notFound } from "next/navigation";

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
