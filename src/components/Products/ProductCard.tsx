import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Truck } from "lucide-react";
import type { Product } from "@/types/product.types";
import AddToCartForm from "./AddToCartForm";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: any) {
  // Debug product stock and data
  // console.log("Product Card Data:", {
  //   id: product._id,
  //   name: product.name,
  //   rawStock: product.stock,
  //   parsedStock: Number(product.stock),
  //   price: product.price,
  //   fullProduct: product
  // });

  // Price calculations with validation
  const sellingPrice = Number(product.price?.sellingPrice) || 0;
  const mrp = Number(product.price?.mrp) || sellingPrice || 0;

  // Temporarily override stock status
  const stock = 100; // Force in stock
  const isInStock = true; // Force available

  /* Original stock logic (commented for now)
  const stock = Number(product.stock);
  const isInStock = !isNaN(stock) && stock > 0;
  */

  // Only calculate discount if both prices are valid
  const discountPercentage =
    sellingPrice > 0 && mrp > 0 && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  // Debug price display
  // console.log("Product Card Price:", {
  //   name: product.name,
  //   sellingPrice,
  //   mrp,
  //   discountPercentage,
  //   rawPrice: product.price
  // });

  const taxRate = product.taxDetails?.rate || 0;
  const isTaxInclusive = product.taxDetails?.isInclusive || false;

  // Stock status with debugging
  const getStockStatus = () => {
    // console.log("Stock Status Check:", {
    //   name: product.name,
    //   stock,
    //   isInStock,
    //   isValid: !isNaN(stock)
    // });

    /* Original stock status logic (commented for now)
    if (!isInStock) {
      return {
        status: "out-of-stock",
        text: "Out of Stock",
        colorClass: "text-red-600 bg-red-50"
      };
    }
    if (stock < 20) {
      return {
        status: "low",
        text: `Only ${stock} left!`,
        colorClass: "text-orange-600 bg-orange-50"
      };
    }
    */

    // Temporarily always return in stock
    return {
      status: "in-stock",
      text: "In Stock",
      colorClass: "text-green-600 bg-green-50"
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="product-card group">
      <Link href={`/product/${product.sku}`}>
        <div className="product-image-container">
          <Image
            src={
              product.pic || product.files?.[0]?.url || "/default-product.jpg"
            }            
            key={
              product.pic || product.files?.[0]?.url || "/default-product.jpg"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Updated Top Badges */}
          <div className="badges-container">
            {product.category?.categoryName && (
              <div className="badge-wrapper">
                <span className="top-badge category-tag">
                  {product.category.categoryName}
                </span>
              </div>
            )}
            {discountPercentage > 0 && (
              <div className="badge-wrapper">
                <span className="top-badge discount-badge">
                  Save {discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Price Display */}
          <div className="price-overlay">
            <div className="price-content">
              <div className="price-stack">
                <div className="price-main">
                  <span className="price-symbol">₹</span>
                  <span className="price-value">
                    {sellingPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                {discountPercentage > 0 && (
                  <div className="price-original">
                    <span className="price-mrp">
                      MRP: ₹{mrp.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="product-info">
          {/* Product Title and Rating */}
          <div className="info-header">
            <h3 className="product-title">{product.name}</h3>
            <div className="rating-wrapper">
              <div className="rating-badge">
                <Star className="rating-star" />
                <span>{product.rating || 4.5}</span>
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="stock-indicator">
            <Truck className="stock-icon" />
            <span className="stock-text">{stockStatus.text}</span>
          </div>
        </div>
      </Link>

      <div className="card-footer">
        <AddToCartForm productId={product._id || product.id} />
      </div>
    </div>
  );
}
