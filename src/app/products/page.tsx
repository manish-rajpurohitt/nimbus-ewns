import { Suspense } from "react";
import ProductList from "@/components/Products/ProductList";
import LoadingSpinner from "@/app/loading";

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: any) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const categoryId = params.category;
  const sortBy = params.sort || "NEWLY_ADDED";

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductList
        initialPage={page}
        initialCategoryId={categoryId}
        initialSortBy={sortBy}
      />
    </Suspense>
  );
}
