import { get } from "@/lib/api";
import ProductDetails from "@/components/Products/ProductDetails";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getPageMEtadata } from "@/utils/common.util";

export default async function ProductPage({ params }: any) {
  try {
    const res: any = await get(
      `/website/fetchProductDetails?productId=${params.sku}`
    );

    if (!res.isSuccess || !res.data?.product) {
      notFound();
    }

    return <ProductDetails product={res.data.product} />;
  } catch (error) {
    console.error("Product page error:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  // Change from array to string
  return getPageMEtadata("about");
}