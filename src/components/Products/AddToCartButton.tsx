"use client";

import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/actions/cart.actions";

export default function AddToCartButton({ productId }: { productId: string }) {
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value="1" />
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-[rgb(1,82,168)] text-white py-3 px-6 rounded-md hover:bg-[rgb(3,48,97)]"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
    </form>
  );
}
