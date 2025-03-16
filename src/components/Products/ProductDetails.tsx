import { Star, Truck } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import AddToCartForm from "./AddToCartForm";
import ProductGalleryClient from "./ProductGalleryClient";
import ProductShare from "./ProductShare";
import type { Product } from "@/types/product.types";

interface ProductProps {
  product: Product;
}

export default function ProductDetails({ product }: any) {
  console.log("Rendering product:", JSON.stringify(product, null, 2));

  // Handle price calculations safely
  const sellingPrice = Number(
    product.price?.sellingPrice || product.sellingPrice || 0
  );
  const mrp = Number(product.price?.mrp || product.mrp || sellingPrice || 0);
  const discountPercentage =
    mrp > 0 ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  // Stock status
  const stockStatus =
    product.stock > 0
      ? product.stock < 20
        ? `Only ${product.stock} left!`
        : "In Stock"
      : "Out of Stock";

  // Get tax details from either location
  const taxDetails = product.taxDetails || {
    rate: product.gst?.rate || 0,
    isInclusive: product.gst?.isInclusive || false
  };

  return (
    <div className="product-container">
      <div className="product-details-container">
        <div className="product-details-grid">
          <div className="product-gallery-wrapper">
            <ProductGalleryClient
              images={product.files}
              productName={product.name}
            />
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="rating-section">
                <div className="stars">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={20}
                      className={`${
                        idx < Math.floor(product.rating || 0)
                          ? "text-[#FFB800] fill-current"
                          : "text-[#D1D5DB]"
                      }`}
                    />
                  ))}
                </div>
                <span className="review-count">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            <div className="product-purchase-section">
              <div className="price-display">
                <div className="price-main">
                  <span className="current-price">
                    ₹{sellingPrice.toLocaleString()}
                  </span>
                  {discountPercentage > 0 && (
                    <div className="price-metadata">
                      <span className="original-price">
                        ₹{mrp.toLocaleString()}
                      </span>
                      <span className="discount-tag">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                </div>
                <div className="tax-info">
                  {taxDetails.isInclusive
                    ? "(Inclusive of all taxes)"
                    : "(+GST)"}
                </div>
              </div>

              <div className="stock-info">
                <Truck className="stock-icon" size={16} />
                <span>{stockStatus}</span>
              </div>

              <div className="purchase-actions">
                <AddToCartForm productId={product._id} />
                <div className="secondary-actions">
                  <ProductShare />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-details">
        {product.description && (
          <>
            <h2 className="section-title">Product Description</h2>
            <div
              className="description-text"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            />
          </>
        )}

        {product.features && product.features.length > 0 && (
          <>
            <h2 className="section-title">Key Features</h2>
            <ul className="features-list">
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
