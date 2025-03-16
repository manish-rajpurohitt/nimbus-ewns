import { ShoppingCart } from "lucide-react";

interface AddToCartProps {
  productId: string;
}

export default function AddToCart({ productId }: AddToCartProps) {
  return (
    <form action="/api/cart/add" method="POST">
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full bg-[rgb(1,82,168)] text-white py-3 px-6 rounded-md hover:bg-[rgb(3,48,97)]"
      >
        <ShoppingCart size={20} />
        Add to Cart
      </button>
    </form>
  );
}
