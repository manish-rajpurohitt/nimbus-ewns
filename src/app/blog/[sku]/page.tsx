import { api } from "@/lib/api";
import { fetchBusinessData } from "@/utils/api.utils";
import BlogDetails from "@/components/Blog/BlogDetails";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPageMEtadata } from "@/utils/common.util";
import { headers } from "next/headers";

export default async function BlogPage({
  params
}:any) {
  try {
    const { sku } = await params;
    const [businessRes, blogRes] :any = await Promise.all([
      fetchBusinessData(),
      api.business.getBlogDetails(sku)
    ]);

    if (!blogRes?.isSuccess || !blogRes.data) {
      notFound();
    }

    const transformedData = {
      data: {
        business: {
          ...businessRes?.data?.business,
          staticData: businessRes?.data?.staticData
        }
      }
    };

    return (
      <BlogDetails businessData={transformedData} blogData={blogRes.data} />
    );
  } catch (error) {
    console.error("Error in BlogPage:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  // console.log("🚀 Running generateMetadata for:", params);

  try {
    const { sku } = await params;
    const headerList = await headers();
    const protocol = headerList.get("x-forwarded-proto") || "https";
    const host = headerList.get("host") || "example.com";
    const fullUrl = `${protocol}://${host}/blog/${sku}`;
    // console.log(params)
    // const fullUrl = `https://icontechpro.com/blog/${sku}`;

    return await getPageMEtadata(fullUrl);
  } catch (error) {
    console.error("⚠️ Metadata Error:", error);
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}