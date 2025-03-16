import Banner from "@/components/Banner";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import { fetchBusinessData } from "@/utils/api.utils";
import { api } from "@/lib/api";
import { debugLog } from "@/utils/debug.util";
import Appointment from "@/components/Appointment";
import Testimonials from "@/components/Testimonials";
import BlogList from "@/components/Blog/BlogList";

export default async function Page() {
  try {
    const [businessRes, servicesRes, blogsRes] = await Promise.all([
      fetchBusinessData(),
      api.business.getServices(1, 6), // Fetch first 6 services for homepage
      api.business.getBlogs(1, 3)
    ]);

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

    return (
      <>
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
    console.error("Error in HomePage:", error);
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <p className="text-gray-600">Failed to load content</p>
      </div>
    );
  }
}
