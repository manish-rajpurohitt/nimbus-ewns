import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/product.types";

interface CategoryListProps {
  categories: Category[];
  selectedCategory?: string;
}

export default function CategoryList({
  categories,
  selectedCategory
}: CategoryListProps) {
  return (
    <div className="categories-section">
      <div className="section-header-ecom">
        <h2>Categories</h2>
      </div>
      <div className="categories-container left">
        <div className="categories-grid">
          <Link
            href="/products"
            className={`category-item ${!selectedCategory ? "selected" : ""}`}
          >
            <div
              className="category-icon categories-background"
              style={{
                backgroundImage: `url('https://cdn3d.iconscout.com/3d/premium/thumb/product-3d-icon-download-in-png-blend-fbx-gltf-file-formats--tag-packages-box-marketing-advertisement-pack-branding-icons-4863042.png?f=webp')`
              }}
            />
            <span className="category-name">All Products</span>
          </Link>

          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products?category=${category._id}`}
              className={`category-item ${
                selectedCategory === category._id ? "selected" : ""
              }`}
            >
              <div
                className="category-icon categories-background"
                style={{
                  backgroundImage: `url(${
                    category.imageUrl ||
                    "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg"
                  })`
                }}
              />
              <span className="category-name">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
