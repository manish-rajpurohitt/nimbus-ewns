import { api } from "@/lib/api";
import { validateProductData } from "@/utils/api.utils";
import ProductCard from "./ProductCard";
import CategoryList from "./CategoryList";
import Pagination from "@/components/common/Pagination";

interface ProductListProps {
  initialPage: number;
  initialCategoryId?: string;
  initialSortBy: string;
}

export default async function ProductList({
  initialPage,
  initialCategoryId,
  initialSortBy
}: ProductListProps) {
  try {
    const ITEMS_PER_PAGE = 3; // Set items per page to 3

    // Fetch data server-side
    const [productsRes, categoriesRes] :any = await Promise.all([
      initialCategoryId
        ? api.products.getProductsByCategory(
            initialCategoryId,
            initialPage,
            ITEMS_PER_PAGE,
            initialSortBy
          )
        : api.products.getProducts(initialPage, ITEMS_PER_PAGE, initialSortBy),
      api.products.getCategories()
    ]);

    // Validate and transform product data
    const products = await Promise.all(
      (productsRes?.data?.products || []).map(async (product: any) => {
        const validatedProduct = await validateProductData(product);
        return validatedProduct;
      })
    );

    const categories = categoriesRes?.data?.categories || [];

    // Get total pages from the response
    const totalProducts = productsRes?.data?.totalProducts || 0;
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    return (
      <div className="product-container mx-auto px-4 py-8">
        <CategoryList
          categories={categories}
          selectedCategory={initialCategoryId}
        />

        <div className="filters-section">
          <div className="filters-header-row">
            <div className="filters-title">
              <h2>Discover Products</h2>
              <p className="filters-subtitle">Find your perfect items</p>
            </div>

            <div className="filters-actions">
              <form className="filters-form">
                <div className="search-box">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search for products..."
                  />
                </div>
                <div className="sort-box">
                  <select
                    name="sort"
                    defaultValue={initialSortBy}
                    className="sort-select"
                  >
                    <option value="NEWLY_ADDED">Newest Arrivals</option>
                    <option value="PRICE_UP">Price: Low to High</option>
                    <option value="PRICE_DOWN">Price: High to Low</option>
                  </select>
                </div>
                <input
                  type="hidden"
                  name="category"
                  value={initialCategoryId || ""}
                />
              </form>
            </div>
          </div>
        </div>

        <div className="products-grid">
          {products?.map((product) => (
            <ProductCard key={product._id || product.sku} product={product} />
          ))}
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="mt-8">
            <Pagination
              currentPage={initialPage}
              totalPages={totalPages}
              basePath="/products"
            />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("ProductList Error:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          Error loading products. Please try again.
        </p>
      </div>
    );
  }
}
