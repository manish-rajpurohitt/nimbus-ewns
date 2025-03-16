import Link from "next/link";
import type { Category } from "@/types/product.types";

interface ProductFilterProps {
  categories: Category[];
  selectedCategory?: string;
  selectedSort: string;
}

export default function ProductFilter({
  categories,
  selectedCategory,
  selectedSort
}: ProductFilterProps) {
  // Helper function to generate filter URLs
  function getFilterUrl(category?: string, sort?: string) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    return `/products?${params.toString()}`;
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full ${
            !selectedCategory
              ? "bg-[rgb(1,82,168)] text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category._id}
            href={getFilterUrl(category._id, selectedSort)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category._id
                ? "bg-[rgb(1,82,168)] text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Sort Form */}
      <form className="w-full md:w-auto">
        <select
          name="sort"
          defaultValue={selectedSort}
          onChange={(e) => {
            const form = e.target.form;
            if (form) form.submit();
          }}
          className="w-full md:w-auto px-4 py-2 border rounded-md"
        >
          <option value="NEWLY_ADDED">Newest First</option>
          <option value="PRICE_UP">Price: Low to High</option>
          <option value="PRICE_DOWN">Price: High to Low</option>
        </select>
        <input type="hidden" name="category" value={selectedCategory || ""} />
      </form>
    </div>
  );
}
