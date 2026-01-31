import { api } from "@/lib/api";
import { fetchBusinessData } from "@/utils/api.utils";
import BlogList from "@/components/Blog/BlogList";
import PageBanner from "@/components/PageBanner";
import { Metadata } from "next";
import { getPageMEtadata } from "@/utils/common.util";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

// Use ISR with shorter revalidation for multi-tenant architecture
export const revalidate = 300; // Revalidate every 5 minutes (good for multi-domain)

interface BlogItem {
  _id: string;
  title: string;
  description: string;
  content?: string;
  createdAt: string;
  sku: string;
  media?: Array<{ url: string }>;
}

export default async function BlogsPage({
  searchParams
}:any) {
  try {
    const resolvedSearchParams = await searchParams;
    const pageNumber = resolvedSearchParams?.page ?? "1";
    const page = Math.max(1, parseInt(pageNumber));
    const limit = 3; // Changed to 6 items per page

    // Fetch data for current page and get total count from same response
    const [businessRes, blogsRes] = await Promise.all([
      fetchBusinessData(),
      api.business.getBlogs(page, limit)
    ]);

    // console.log("Blog Data:", {
    //   totalBlogsAvailable: totalBlogs,
    //   currentPageBlogs: blogsRes?.data?.blogs?.length,
    //   currentPage: page,
    //   itemsPerPage: limit
    // });

    if (!businessRes?.isSuccess) {
      throw new Error("Failed to fetch business data");
    }

    if (!blogsRes?.isSuccess || !blogsRes?.data?.blogs) {
      throw new Error("Failed to fetch blogs");
    }

    // Get total blogs from pagination data
    const totalBlogs = blogsRes.data.pagination?.totalItems || blogsRes.data.blogs.length;
    const totalPages = Math.max(Math.ceil(totalBlogs / limit), 1);

    // Transform blog data to match expected format
    const transformedBlogs = blogsRes.data.blogs.map((blog: any) => ({
      _id: blog._id,
      title: blog.title,
      description: blog.content || blog.description || "",
      createdAt: blog.createdAt || new Date().toISOString(),
      sku: blog.sku || blog._id,
      media: blog.media || []
    }));

    const transformedData = {
      data: {
        business: {
          staticData: {
            blogs: businessRes.data.staticData?.blogs,
            home: {
              blogs: businessRes.data.staticData?.home?.blogs
            }
          }
        }
      }
    };

    const staticData = businessRes.data.staticData.blogs;

    return (
      <>
        <PageBanner
          bannerImage= {staticData?.bannerUrl || "https://www.swg.com/can/wp-content/uploads/sites/38/2014/09/About-us-banner.jpg"}
          title="Our Blog"
          currentPage="Blog"
        />
        <BlogList
          blogs={transformedBlogs}
          businessData={transformedData}
          currentPage={page}
          totalPages={Math.ceil(totalBlogs / limit)}
          isHomepage={false}
        />
      </>
    );
  } catch (error) {
    console.error("Error in BlogsPage:", error);
    notFound();
  }
}


export async function generateMetadata({ params}: { params: any; }): Promise<Metadata> {
  // console.log("🚀 Running generateMetadata for:", params);

  try {

    const headerList = await headers();
    const protocol = headerList.get("x-forwarded-proto") || "https";
    const host = headerList.get("host") || "example.com";
    const fullUrl = `${protocol}://${host}/blogs`;
    // console.log(params)
    // const fullUrl = `https://icontechpro.com/blogs`;

    return await getPageMEtadata(fullUrl);
  } catch (error) {
    console.error("⚠️ Metadata Error:", error);
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}