import { fetchBusinessData, fetchBusinessAddress } from "@/utils/api.utils";
import ContactForm from "@/components/Contact/ContactForm";
import ContactDetails from "@/components/Contact/ContactDetails";
import PageBanner from "@/components/PageBanner";
import { notFound } from "next/navigation";

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

    return (
      <div className="main-page-container">
        <div
          className="banner-page"
          style={{
            backgroundImage: `url(${bannerImage})`,
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
