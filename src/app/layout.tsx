import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fetchBusinessData, fetchBusinessAddress } from "@/utils/api.utils";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PathDebugger from "@/components/PathDebugger";
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

export const metadata: Metadata = {
  title: "Business Website",
  description: "Welcome to our business website"
};

async function getInitialData() {
  try {
    const [businessRes, addressRes] : any = await Promise.all([
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

  // Get path from multiple sources for consistency
  const routePath = headersList.get("x-route-path");
  const cookiePath = cookieStore.get("current-path")?.value;
  const pathname = routePath || cookiePath || "/";
  const host = headersList.get("host"); // This returns hostname with optional port

  console.log("Path sources:", {
    routePath,
    cookiePath,
    finalPath: pathname
  });

  const hideHeaderFooter = pathname.includes("/media/");
  const data :any = await getInitialData(host);
  const cart :any = await getCart();
  const cartCount = cart?.items?.length || 0;

  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .scroll-btn-hidden { opacity: 0; pointer-events: none; }
              .scroll-btn-visible { opacity: 1; pointer-events: auto; }
              .initial-loader {
                position: fixed;
                inset: 0;
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(4px);
                z-index: 9999;
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
              // Page loader
              document.addEventListener('DOMContentLoaded', function() {
                if (!window.initialLoadComplete) {
                  window.initialLoadComplete = true;
                  const loaderDiv = document.createElement('div');
                  loaderDiv.className = 'initial-loader';
                  loaderDiv.innerHTML = '<div class="loader-spinner"></div>';
                  document.body.appendChild(loaderDiv);
                  
                  setTimeout(() => {
                    loaderDiv.classList.add('hide');
                    setTimeout(() => loaderDiv.remove(), 300);
                  }, 800);
                }
              });

              // Scroll to top functionality
              document.addEventListener('DOMContentLoaded', function() {
                const scrollBtn = document.getElementById('scroll-top');
                if (!scrollBtn) return;
                
                scrollBtn.classList.add('scroll-btn-hidden');

                window.addEventListener('scroll', () => {
                  requestAnimationFrame(() => {
                    const shouldShow = window.pageYOffset > 300;
                    scrollBtn.classList.toggle('scroll-btn-hidden', !shouldShow);
                    scrollBtn.classList.toggle('scroll-btn-visible', shouldShow);
                  });
                });

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
                key={pathname} // Force remount on path change
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
              pathname={pathname}
            />
          )}
        </div>
        {/* <PathDebugger pathname={pathname} /> */}
        <button
          id="scroll-top"
          className="fixed bottom-8 right-8 bg-[rgb(1,82,168)] text-white p-3 rounded-full shadow-lg transition-all duration-300"
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
