// SSR with ISR - Revalidate every 3 minutes (balances freshness with performance)
// Content is cached and regenerated in background for better multi-domain performance
export const revalidate = 180;

import { fetchBusinessData } from "@/utils/api.utils";
import { api } from "@/lib/api";
import { generateHomeMetadata } from "@/lib/metadata";
import { debugLog } from "@/utils/debug.util";
import Appointment from "@/components/Appointment";
import JsonLd from "@/components/common/JsonLd";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Dynamic imports for better code splitting
const Banner = dynamic(() => import('@/components/Banner'));
const AboutUs = dynamic(() => import('@/components/AboutUs'));
const Services = dynamic(() => import('@/components/Services'));
const Testimonials = dynamic(() => import('@/components/Testimonials'));
const BlogList = dynamic(() => import('@/components/Blog/BlogList'));

/**
 * Generate metadata for homepage with proper SEO
 * This runs on every request but uses cached data
 */
export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata();
}


export default async function Page() {
  try {
    // Fetch all data in parallel for better performance
    const [businessRes, servicesRes, blogsRes] = await Promise.all([
      fetchBusinessData(),
      api.business.getServices(1, 6), // First 6 services for homepage
      api.business.getBlogs(1, 3) // First 3 blogs for homepage
    ]);

    if (!businessRes?.isSuccess) {
      throw new Error("Failed to fetch business data");
    }

    // Transform data structure for components
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

    // Generate schema for JSON-LD
    const schema = {
      "@context": "https://schema.org",
      "@type": businessRes?.data?.business?.category || "LocalBusiness",
      "name": businessRes?.data?.business?.businessName,
      "image": businessRes?.data?.business?.logoURl,
      "url": businessRes?.data?.business?.websiteUrl,
      "description": businessRes?.data?.business?.description,
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
            blogs={(blogsRes?.data?.blogs || []) as any}
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
    console.error("Error in HomePage:", error);
    notFound();
  }
}