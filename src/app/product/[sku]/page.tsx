import { get } from "@/lib/api";
import ProductDetails from "@/components/Products/ProductDetails";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";

export default async function ProductPage({
  params
}:any) {
  try {
    const res : any= await get(
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

// Generate metadata for the page
export async function generateMetadata({
  params
}:any) {
  try {
    const response = await api.products.getProductDetails(params.sku);
    const product = response.data?.product;

    return {
      title: product?.name || "Product Details",
      description: product?.description || "Product description"
    };
  } catch {
    return {
      title: "Product Details",
      description: "View product details"
    };
  }
}
