import { api } from "@/lib/api";
import { fetchBusinessData } from "@/utils/api.utils";
import BlogDetails from "@/components/Blog/BlogDetails";
import { notFound } from "next/navigation";

export default async function BlogPage({
  params
}:any) {
  try {
    const [businessRes, blogRes] :any = await Promise.all([
      fetchBusinessData(),
      api.business.getBlogDetails(params.sku)
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
