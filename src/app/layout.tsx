import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fetchBusinessData, fetchBusinessAddress } from "@/utils/api.utils";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { cookies } from "next/headers";
import { getCart } from "@/actions/cart.actions";
import { Toaster } from "sonner";
import "@/assets/css/index";
import "@/assets/ecom-css/index";
import "@/assets/css/albums.css";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const businessRes = await fetchBusinessData();
  const business = businessRes?.data?.business;

  if (!business) {
    console.error("Failed to fetch business data for metadata");
    return {
      title: "Loading...",
      icons: {
        icon: [{ url: "/favicon.ico", type: "image/x-icon" }]
      }
    };
  }

  const description =
    business.description || `Welcome to ${business.businessName}`;
  const keywords =
    business.keywords || `${business.businessName}, services, business`;

  return {
    title: {
      default: business.businessName,
      template: `%s | ${business.businessName}`
    },
    description: description,
    keywords: keywords,
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: "website",
      title: business.businessName,
      description: description,
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
      title: business.businessName,
      description: description,
      images: [business.logoURl || "/favicon.ico"],
      creator: "@" + (business.twitterHandle || business.businessName)
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
          url: business.logoURl || "/favicon.ico",
          type: "image/x-icon"
        }
      ],
      shortcut: ["/favicon.ico"],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }]
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined
    }
  };
}

async function getInitialData() {
  try {
    const [businessRes, addressRes]: any = await Promise.all([
      fetchBusinessData(),
      fetchBusinessAddress()
    ]);

    return {
      business: businessRes?.isSuccess ? businessRes.data?.business : null,
      static: businessRes?.isSuccess ? businessRes.data?.staticData : null,
      address: addressRes?.isSuccess ? addressRes.data?.address : null
    };
  } catch (error) {
    console.error("Error in getInitialData:", error);
    return { business: null, static: null, address: null, user: null };
  }
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const cookieStore = await cookies();

  const pathname = headersList.get("x-pathname") || "/";
  const hideHeaderFooter = pathname.includes("/media/");
  const data = await getInitialData();
  const cart = await getCart();
  const cartCount = cart?.items?.length || 0;

  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .scroll-btn-hidden { opacity: 0; pointer-events: none; }
              .scroll-btn-visible { opacity: 1; pointer-events: auto; cursor:pointer }
              .initial-loader {
                position: absolute; /* Changed from fixed to absolute */
                inset: 0;
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(4px);
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.3s;
              }
              .initial-loader.hide { opacity: 0; }
              .loader-spinner {
                width: 3rem;
                height: 3rem;
                border: 4px solid rgb(1,82,168);
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Improved Page loader
              document.addEventListener('DOMContentLoaded', function() {
                if (!window.initialLoadComplete) {
                  window.initialLoadComplete = true;
                  const loaderDiv = document.createElement('div');
                  loaderDiv.className = 'initial-loader';
                  loaderDiv.setAttribute('data-testid', 'loader');
                  loaderDiv.innerHTML = '<div class="loader-spinner"></div>';
                  
                  // Append to main content instead of body
                  const mainContent = document.querySelector('main');
                  if (mainContent) {
                    mainContent.appendChild(loaderDiv);
                  }
                  
                  setTimeout(() => {
                    loaderDiv.classList.add('hide');
                    setTimeout(() => loaderDiv.remove(), 300);
                  }, 800);
                }
              });

              // Improved Scroll to top functionality
              document.addEventListener('DOMContentLoaded', function() {
                const scrollBtn = document.getElementById('scroll-top');
                if (!scrollBtn) return;
                
                const handleScroll = () => {
                  const shouldShow = window.pageYOffset > 300;
                  if (shouldShow && scrollBtn.classList.contains('scroll-btn-hidden')) {
                    scrollBtn.classList.remove('scroll-btn-hidden');
                    scrollBtn.classList.add('scroll-btn-visible');
                  } else if (!shouldShow && scrollBtn.classList.contains('scroll-btn-visible')) {
                    scrollBtn.classList.remove('scroll-btn-visible');
                    scrollBtn.classList.add('scroll-btn-hidden');
                  }
                };

                let ticking = false;
                window.addEventListener('scroll', () => {
                  if (!ticking) {
                    window.requestAnimationFrame(() => {
                      handleScroll();
                      ticking = false;
                    });
                    ticking = true;
                  }
                }, { passive: true });

                scrollBtn.addEventListener('click', (e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                });
              });
            `
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="min-h-screen flex flex-col">
          {!hideHeaderFooter && (
            <>
              <Header businessData={data.business} staticData={data.static} />
              <Navbar
                businessData={data.business}
                staticData={data.static}
                pathname={pathname}
                key={pathname}
                cartCount={cartCount}
              />
            </>
          )}
          <main className="flex-1">{children}</main>
          {!hideHeaderFooter && (
            <Footer
              businessData={data.business}
              businessAddress={data.address}
              staticData={data.static}
            />
          )}
        </div>
        <button
          id="scroll-top"
          className="fixed bottom-8 right-8 bg-[rgb(1,82,168)] text-white p-3 rounded-full shadow-lg transition-all duration-300 scroll-btn-hidden"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
