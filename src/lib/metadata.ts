/**
 * Metadata Generation Utility
 * Generates dynamic metadata for pages with caching support
 * Optimized for multi-tenant SSR with domain-based content
 */

import { Metadata } from "next";
import { headers } from "next/headers";
import { api, getMetaTagsOfPage } from "./api";
import { convert } from "html-to-text";
import { fetchBusinessData } from "@/utils/api.utils";

interface BusinessData {
  businessName?: string;
  logoURl?: string;
  websiteUrl?: string;
  description?: string;
  shortBio?: string;
  phone?: string;
  category?: string;
  address?: {
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  socialLinks?: string[];
  externalLinks?: Array<{ url: string }>;
}

interface MetaTagData {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

/**
 * Generate metadata for homepage
 */
export async function generateHomeMetadata(): Promise<Metadata> {
  try {
    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") || "https";
    const host = headersList.get("host") || "example.com";
    const canonicalUrl = `${protocol}://${host}/`;

    // Fetch business data and meta tags in parallel
    const [businessRes, metaTagsRes]: any = await Promise.all([
      fetchBusinessData(),
      getMetaTagsOfPage("home")
    ]);

    const business: BusinessData = businessRes?.data?.business || {};
    const metaTags: MetaTagData = metaTagsRes?.metaTags || {};

    const businessName = business.businessName || "Business";
    const description = metaTags.description || 
      convert(business.shortBio || business.description || "", { wordwrap: false }).slice(0, 160);
    
    const title = metaTags.title || `${businessName} - Home`;
    const keywords = metaTags.keywords || `${businessName}, ${business.category}`;
    
    const ogImage = metaTags.ogImage || business.logoURl || "";
    const ogTitle = metaTags.ogTitle || title;
    const ogDescription = metaTags.ogDescription || description;

    return {
      title,
      description,
      keywords,
      authors: [{ name: businessName }],
      creator: businessName,
      publisher: businessName,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: canonicalUrl,
        siteName: businessName,
        title: ogTitle,
        description: ogDescription,
        images: ogImage ? [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: businessName,
          },
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: ogImage ? [ogImage] : [],
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
    };
  } catch (error) {
    console.error("[Metadata] Error generating home metadata:", error);
    return {
      title: "Home",
      description: "Welcome to our website",
    };
  }
}

/**
 * Generate metadata for dynamic pages (blogs, products, services, etc.)
 */
export async function generateDynamicMetadata(
  pageType: "blog" | "product" | "service" | "team",
  slug: string
): Promise<Metadata> {
  try {
    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") || "https";
    const host = headersList.get("host") || "example.com";
    const canonicalUrl = `${protocol}://${host}/${pageType}/${slug}`;

    let itemData: any = null;
    let businessRes: any = null;

    // Fetch item data based on type
    switch (pageType) {
      case "blog":
        const [blog, business] = await Promise.all([
          api.business.getBlogDetails(slug),
          fetchBusinessData()
        ]);
        itemData = blog?.data;
        businessRes = business;
        break;
      case "product":
        const [product, businessP] = await Promise.all([
          api.products.getProductDetails(slug),
          fetchBusinessData()
        ]);
        itemData = product?.data?.product;
        businessRes = businessP;
        break;
      case "service":
        const [service, businessS] = await Promise.all([
          api.business.getServiceDetails(slug),
          fetchBusinessData()
        ]);
        itemData = service?.data;
        businessRes = businessS;
        break;
      default:
        return { title: "Not Found" };
    }

    if (!itemData) {
      return { title: "Not Found" };
    }

    const businessName = businessRes?.data?.business?.businessName || "Business";
    const title = itemData.title || itemData.name || "Item";
    const description = convert(
      itemData.description || itemData.shortDescription || "",
      { wordwrap: false }
    ).slice(0, 160);
    
    const image = itemData.mainImage || itemData.image || itemData.thumbnail || "";

    return {
      title: `${title} | ${businessName}`,
      description,
      keywords: itemData.tags?.join(", ") || title,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "article",
        locale: "en_US",
        url: canonicalUrl,
        siteName: businessName,
        title,
        description,
        images: image ? [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ] : [],
        publishedTime: itemData.createdAt,
        modifiedTime: itemData.updatedAt,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : [],
      },
    };
  } catch (error) {
    console.error(`[Metadata] Error generating ${pageType} metadata:`, error);
    return {
      title: "Item",
      description: "View details",
    };
  }
}

/**
 * Generate metadata for listing pages (blogs list, products list, etc.)
 */
export async function generateListingMetadata(
  pageType: "blogs" | "products" | "services" | "teams" | "testimonials" | "contact" | "about"
): Promise<Metadata> {
  try {
    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") || "https";
    const host = headersList.get("host") || "example.com";
    const canonicalUrl = `${protocol}://${host}/${pageType}`;

    // Fetch business data and page-specific meta tags
    const [businessRes, metaTagsRes]: any = await Promise.all([
      fetchBusinessData(),
      getMetaTagsOfPage(pageType)
    ]);

    const business: BusinessData = businessRes?.data?.business || {};
    const metaTags: MetaTagData = metaTagsRes?.metaTags || {};

    const businessName = business.businessName || "Business";
    const pageTitle = pageType.charAt(0).toUpperCase() + pageType.slice(1);
    
    const title = metaTags.title || `${pageTitle} | ${businessName}`;
    const description = metaTags.description || 
      `Explore our ${pageType.toLowerCase()} at ${businessName}`;
    const keywords = metaTags.keywords || `${businessName}, ${pageType}, ${business.category}`;

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: canonicalUrl,
        siteName: businessName,
        title,
        description,
        images: metaTags.ogImage || business.logoURl ? [
          {
            url: metaTags.ogImage || business.logoURl || "",
            width: 1200,
            height: 630,
            alt: businessName,
          },
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    console.error(`[Metadata] Error generating ${pageType} metadata:`, error);
    return {
      title: pageType,
      description: `View ${pageType}`,
    };
  }
}

/**
 * Generate JSON-LD schema for a page
 */
export function generateSchemaMarkup(
  business: BusinessData,
  type: "Organization" | "LocalBusiness" | "Article" = "LocalBusiness"
) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type === "Article" ? "Article" : business.category || type,
    name: business.businessName,
    image: business.logoURl,
    url: business.websiteUrl,
    description: convert(business.shortBio || business.description || "", { wordwrap: false }),
  };

  if (type !== "Article" && business.address) {
    return {
      ...baseSchema,
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address.addressLine1 || "",
        addressLocality: business.address.city || "",
        addressRegion: business.address.state || "",
        postalCode: business.address.pincode || "",
        addressCountry: "IN",
      },
      telephone: business.phone || "",
      sameAs: business.externalLinks?.map(link => link.url) || [],
    };
  }

  return baseSchema;
}

export default {
  generateHomeMetadata,
  generateDynamicMetadata,
  generateListingMetadata,
  generateSchemaMarkup,
};
