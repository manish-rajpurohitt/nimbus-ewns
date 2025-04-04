import { api, getMetaTagsOfPage } from "@/lib/api";
import { fetchBusinessData } from "@/utils/api.utils"; // Add this import
import type { Business, BusinessAddress } from "@/types/business.types";
import { headers } from "next/headers";

// Format business address
export const getBusinessAdd = (businessAddress: BusinessAddress): string => {
  if (!businessAddress) return "";
  return (
    businessAddress.addressLine1 +
    ", " +
    businessAddress.addressLine2 +
    ", " +
    businessAddress.landmark +
    ", " +
    businessAddress.city +
    " - " +
    businessAddress.pincode +
    ", " +
    businessAddress.state +
    ", " +
    businessAddress.country +
    "."
  );
};

// Add a utility function to get the default domain
export const getDefaultDomain = (): string => {
  return process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "kjsdental.co.in";
};

// Get hostname (safely works on both client and server)
export const getHostName = () => {
  if (typeof window !== "undefined") {
    // Client-side
    const hostname = window.location.hostname;
    if (hostname === "localhost") {
      return getDefaultDomain();
    }
    return hostname;
  }

  // Server-side
  try {
    const headersList = headers();
    const host = headersList.get("host") || "";
    if (host.includes("localhost")) {
      return getDefaultDomain();
    }
    return host.split(":")[0]; // Remove port if present
  } catch (error) {
    return getDefaultDomain();
  }
};

// Generate navigation pages based on business settings
export function generatePages(business: Business) {
  const pages: any = [];

  // Add Home page
  pages.push({
    hasChildren: false,
    label: "Home",
    to: "/",
    group: "navbar-middle",
    visible: true,
    children: []
  });

  // Add Services page if enabled
  if (business?.showServices) {
    pages.push({
      hasChildren: false,
      label: "Services",
      to: "/services",
      group: "navbar-middle",
      visible: true,
      children: []
    });
  }

  // Add Blogs page if enabled
  if (business?.showBlogs) {
    pages.push({
      hasChildren: false,
      label: "Blogs",
      to: "/blogs",
      group: "navbar-middle",
      visible: true,
      children: []
    });
  }

  if (business?.showProducts) {
    pages.push({
      hasChildren: false,
      label: "Products",
      to: "/products",
      group: "navbar-middle",
      visible: true,
      children: []
    });
  }

  // Add About page
  pages.push({
    hasChildren: false,
    label: "About",
    to: "/about",
    group: "navbar-middle",
    visible: true,
    children: []
  });

  pages.push({
    hasChildren: false,
    label: "Contact",
    to: "/contact",
    group: "navbar-middle",
    visible: true,
    children: []
  });

  // Add Pages menu with submenus based on configuration
  const subPages: any = [];

  if (business?.showAlbums) {
    subPages.push({
      hasChildren: false,
      label: "Albums",
      to: "/albums",
      group: "",
      visible: true,
      children: []
    });
  }

  if (business?.showTeams) {
    subPages.push({
      hasChildren: false,
      label: "Teams",
      to: "/teams",
      group: "",
      visible: true,
      children: []
    });
  }

  if (subPages.length > 0) {
    pages.push({
      hasChildren: true,
      label: "Pages",
      to: "#",
      group: "navbar-middle",
      visible: true,
      children: subPages
    });
  }

  // Add User Authentication pages if enabled
  if (business && business.enableUserLogin === false) {
    pages.push({
      hasChildren: false,
      label: "Sign Up",
      to: "/register",
      group: "navbar-auth",
      visible: true,
      children: []
    });
    pages.push({
      hasChildren: false,
      label: "Login",
      to: "/login",
      group: "navbar-auth",
      visible: true,
      children: []
    });
  }

  // Add E-commerce related pages if enabled
  if (business?.enableOrders || business?.enableEcommerce) {
    pages.push({
      hasChildren: false,
      label: "Orders",
      to: "/orders",
      group: "navbar-commerce",
      visible: true,
      children: []
    });
    pages.push({
      hasChildren: false,
      label: "Cart",
      to: "/cart",
      group: "navbar-commerce",
      visible: true,
      children: []
    });
  }

  return pages;
}

// Remove HTML tags from a string
export function removeHtmlTags(htmlString: string) {
  return htmlString.replace(/<[^>]*>/g, "").trim();
}

// Business quotes for random display
export const businessQuotes = [
  "Success is not the key to happiness. Happiness is the key to success. – Albert Schweitzer",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Your most unhappy customers are your greatest source of learning. – Bill Gates",
  "The best way to predict the future is to create it. – Peter Drucker",
  "Don't be afraid to give up the good to go for the great. – John D. Rockefeller",
  "Opportunities don't happen, you create them. – Chris Grosser",
  "It always seems impossible until it's done. – Nelson Mandela",
  "The road to success and the road to failure are almost exactly the same. – Colin R. Davis",
  "Business opportunities are like buses, there's always another one coming. – Richard Branson",
  "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau"
];

export const getPageMEtadata = async (
  url: string,
  logoUrl: any = null
): Promise<any> => {
  try {
    const businessData = await fetchBusinessData();
    const businessName = businessData?.data?.business?.businessName;
    const businessDescription = businessData?.data?.business?.description;
    const businessLogo = businessData?.data?.business?.logoURl;

    const metaTags = await getMetaTagsOfPage(url);
    if (!metaTags?.isSuccess) {
      return {
        title: businessName || "Business Website",
        description: businessDescription || "Welcome to our website",
        icons: {
          icon: [
            {
              url: businessLogo || "/favicon.ico",
              type: "image/x-icon"
            }
          ]
        },
        openGraph: {
          title: businessName,
          description: businessDescription,
          url,
          images: [businessLogo || "/default-og-image.jpg"],
          type: "website"
        }
      };
    }

    return {
      title: businessName || metaTags?.title,
      description: businessDescription || metaTags?.description,
      keywords: metaTags?.keywords?.map((k: any) => k.keyword).join(", "),
      alternates: {
        canonical: metaTags?.canonical || url
      },
      openGraph: {
        title: businessName || metaTags?.title,
        description: businessDescription || metaTags?.description,
        url,
        images: [businessLogo || metaTags?.ogImage || "/default-og-image.jpg"],
        type: "website"
      },
      twitter: {
        card: "summary_large_image",
        title: businessName || metaTags?.title,
        description: businessDescription || metaTags?.description,
        images: [businessLogo || metaTags?.ogImage || "/default-og-image.jpg"]
      },
      robots: "index, follow",
      authors: [{ name: businessName || "EWNS" }],
      icons: {
        icon: [
          {
            url: businessLogo || "/favicon.ico",
            type: "image/x-icon"
          }
        ]
      },
      metadataBase: new URL(url)
    };
  } catch (error) {
    const businessData = await fetchBusinessData();
    const businessName = businessData?.data?.business?.businessName;
    return {
      title: businessName || "Business Website",
      description: "Welcome to our website",
      icons: {
        icon: [{ url: "/favicon.ico", type: "image/x-icon" }]
      }
    };
  }
};
