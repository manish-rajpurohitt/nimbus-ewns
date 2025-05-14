import { fetchBusinessData, fetchBusinessAddress } from "@/utils/api.utils";
import ContactForm from "@/components/Contact/ContactForm";
import ContactDetails from "@/components/Contact/ContactDetails";
import PageBanner from "@/components/PageBanner";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getPageMEtadata } from "@/utils/common.util";
import { Metadata } from "next";

const DEFAULT_BANNER =
  "https://whiteklay.com/wp-content/uploads/2020/12/Contact-us-Main-Banner-1.jpg";

export default async function ContactPage() {
  try {
    const [businessRes, addressRes] :any = await Promise.all([
      fetchBusinessData(),
      fetchBusinessAddress()
    ]);

    if (!businessRes?.isSuccess || !addressRes?.isSuccess) {
      notFound();
    }

    const bannerImage =
      businessRes.data?.staticData?.pageBanners?.find(
        (banner: any) => banner.type === "contact"
      )?.image || DEFAULT_BANNER;
      const staticData = businessRes.data.staticData.contactDetails;

    return (
      <div className="main-page-container">
        <div
          className="banner-page"
          style={{
            backgroundImage: `url(${staticData?.bannerUrl || bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="overlay-pages">
            <div className="navigation">
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <span style={{ margin: "0 2px", color: "#f0f0f0" }}>
                    &gt;&gt;
                  </span>
                </li>
                <li>
                  <a href="#" className="active">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div className="navigation-content">
              <h1>Contact Us</h1>
            </div>
          </div>
        </div>

        <ContactDetails
          business={businessRes.data.business}
          address={addressRes.data?.address}
          staticData={businessRes.data.staticData?.contactDetails}
        />

        <div className="max-w-4xl mx-auto px-4 py-16">
          <ContactForm
            businessId={businessRes.data.business._id}
            staticData={businessRes.data.staticData?.contactForm}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ContactPage:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: { params: any; }): Promise<Metadata> {
  // console.log("🚀 Running generateMetadata for:", params);

  try {

    const headerList = await headers();
    const protocol = headerList.get("x-forwarded-proto") || "https";
    const host = headerList.get("host") || "example.com";
    const fullUrl = `${protocol}://${host}/contact`;
    // const fullUrl = `https://icontechpro.com/contact`;

    return await getPageMEtadata(fullUrl);
  } catch (error) {
    console.error("⚠️ Metadata Error:", error);
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}