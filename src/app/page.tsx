import Banner from "@/components/Banner";
import AboutUs from "@/components/AboutUs";
import { redirect } from "next/navigation";
import Services from "@/components/Services";
import { fetchBusinessData, getRedirectUrl } from "@/utils/api.utils";
import { api, getMetaTagsOfPage } from "@/lib/api";
import { debugLog } from "@/utils/debug.util";
import Appointment from "@/components/Appointment";
import Testimonials from "@/components/Testimonials";
import BlogList from "@/components/Blog/BlogList";
import { headers } from "next/headers";
import { Metadata } from "next";
import { getPageMEtadata } from "@/utils/common.util";
import { convert } from "html-to-text";
import JsonLd from "@/components/common/JsonLd";


export default async function Page() {
  try {
    const [businessRes, servicesRes, blogsRes, isRedirect] = await Promise.all([
      fetchBusinessData(),
      api.business.getServices(1, 6), // Fetch first 6 services for homepage
      api.business.getBlogs(1, 3),
      getRedirectUrl()
    ]);

    if (
      isRedirect?.isSuccess &&
      isRedirect?.data?.isRedirect &&
      isRedirect?.data?.redirectDomain
    ) {
      try{
        const target = isRedirect.data.redirectDomain.startsWith("http")
        ? isRedirect.data.redirectDomain
        : `https://${isRedirect.data.redirectDomain}`;
    
      redirect(target);
      }
      catch(Er){
        // console.log(Er);
      }
      
    }

    if (!businessRes?.isSuccess) {
      throw new Error("Failed to fetch business data");
    }

    // Transform the data to properly include all needed sections
    const transformedData = {
      business: {
        ...businessRes.data.business,
        ...businessRes.data.business.businessData,
        enableAppointments: businessRes.data.business.enableAppointments,
        staticData: {
          ...businessRes.data.staticData,
          home: {
            ...businessRes.data.staticData?.home,
            appointment: businessRes.data.staticData?.home?.appointment,
            testimonials: businessRes.data.staticData?.home?.testimonials
          }
        }
      }
    };

    debugLog("HomePage", "Transformed business data", transformedData);
    const schema = {
      "@context": "https://schema.org",
      "@type": businessRes?.data?.business?.category,
      "name": businessRes?.data?.business?.businessName,
      "image": businessRes?.data?.business?.logoURl,
      "url": businessRes?.data?.business?.websiteUrl,
      "description": convert(businessRes?.data?.business?.description, { wordwrap: false }),
      "address": {
        "@type": "PostalAddress",
        "streetAddress": businessRes?.data?.business?.address?.addressLine1 || "",
        "addressLocality": transformedData?.business?.address?.city || "",
        "addressRegion": transformedData?.business?.address?.state || "",
        "postalCode": businessRes?.data?.business?.address?.pincode || "",
        "addressCountry": "IN"
      },
      "telephone": businessRes?.data?.business?.phone || "+91-0000000000",
      "sameAs": businessRes?.data?.business?.socialLinks || []
    };

    const headerList = await headers();
    const protocol = headerList.get("x-forwarded-proto") || "https";
    const host = headerList.get("host") || "example.com";
    const fullUrl = `${protocol}://${host}/`;
    
    return (
      <>
        <JsonLd data={schema} />
        <div className="bg-white">
          <Banner businessData={transformedData} />
        </div>
        <div className="bg-gray-50">
          <AboutUs businessData={transformedData} />
        </div>
        <div className="bg-white">
          <Services
            businessData={transformedData}
            services={servicesRes?.data?.services || []}
            isHomepage={true}
          />
        </div>
        <div className="bg-gray-50">
          <Appointment businessData={transformedData} />
        </div>
        <div className="bg-white">
          <Testimonials
            testimonials={transformedData.business?.testimonials || []}
            staticData={
              transformedData.business?.staticData?.home?.testimonials
            }
            isHomepage={true}
          />
        </div>
        <div className="bg-gray-50">
          <BlogList
            blogs={(blogsRes?.data?.blogs || []).map((blog) => ({
              ...blog,
              createdAt: (blog as any).createdAt || new Date().toISOString(),
              sku: (blog as any).sku || "",
              description: (blog as any).description || ""
            }))}
            businessData={{
              data: {
                business: {
                  staticData: {
                    blogs: transformedData.business.staticData?.home?.blogs
                  }
                }
              }
            }}
            isHomepage={true}
          />
        </div>
      </>
    );
  } catch (error) {
    // console.error("Error in HomePage:", error);
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <p className="text-gray-600">Failed to load content</p>
      </div>
    );
  }
}


export async function generateMetadata(): Promise<Metadata> {
  const businessRes = await fetchBusinessData();
  const metaData = await getMetaTagsOfPage(`${businessRes?.data?.business?.websiteUrl}/`);
  const business = businessRes?.data?.business;

  if (!business) {
    // console.error("Failed to fetch business data for metadata");
    return {
      title: "Loading...",
      icons: {
        icon: [{ url: "/favicon.ico", type: "image/x-icon" }]
      }
    };
  }

  const description = convert(business.description, {
    wordwrap: false, // optional
    selectors: [{ selector: 'a', options: { ignoreHref: true } }] // optional
  })  || `Welcome to ${business.businessName}`;
  
  const keywords =
    metaData.keywords || [];

  return {
    title: {
      default: metaData.title,
      template: `%s | ${business.businessName}`
    },
    description: businessRes.data.business.shortBio,
    keywords: keywords?.map((keyword: any) => keyword?.keyword?.trim()).join(", "),
    metadataBase: businessRes.data.business.websiteUrl,
    openGraph: {
      type: "website",
      title: metaData.title,
      description: businessRes.data.business.shortBio,
      siteName: business.businessName,
      images: [
        {
          url: business.logoURl || "/favicon.ico",
          width: 1200,
          height: 630,
          alt: business.businessName
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: metaData.title,
      description: businessRes.data.business.shortBio,
      images: [business.logoURl || "/favicon.ico"],
      creator: "@" + business.businessName
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    icons: {
      icon: [
        {
          url: business.logoURl,
          type: "image/x-icon"
        }
      ],
      shortcut: business.logoURl ? [business.logoURl] : ["/favicon.ico"],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }]
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined
    },
    alternates: {
      canonical: `${business.websiteUrl}/`
    }
  };
}