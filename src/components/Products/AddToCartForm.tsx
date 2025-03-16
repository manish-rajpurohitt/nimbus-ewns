"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { addToCart } from "@/actions/cart.actions";
import { toast } from "sonner";

export default function AddToCartForm({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("quantity", "1");

      const result = await addToCart(formData);

      if (result.success) {
        setShowSuccess(true);
        toast.success("Added to cart!");
        router.refresh();

        // Reset success state after 2 seconds
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        if (result.error === "Please login to add items to cart") {
          toast.error("Please login to continue", {
            action: {
              label: "Login",
              onClick: () =>
                router.push(
                  `/login?redirect=${encodeURIComponent(
                    window.location.pathname
                  )}`
                )
            }
          });
        } else {
          toast.error(result.error || "Failed to add to cart");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <button
          type="submit"
          disabled={isLoading || showSuccess}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-200 disabled:opacity-50
            bg-[rgb(1,82,168)] hover:bg-[rgb(3,48,97)] text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Adding...</span>
            </>
          ) : showSuccess ? (
            <>
              <Check className="w-5 h-5" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
