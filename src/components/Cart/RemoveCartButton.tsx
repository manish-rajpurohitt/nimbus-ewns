"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { removeFromCart } from "@/actions/cart.actions";
import { toast } from "sonner";

interface RemoveCartButtonProps {
  productId: string;
  quantity: number;
  itemName: string;
}

export default function RemoveCartButton({
  productId,
  quantity,
  itemName
}: RemoveCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!confirm(`Remove ${itemName} from cart?`)) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("quantity", quantity.toString());

      const result = await removeFromCart(formData);

      if (result.success) {
        toast.success("Item removed from cart");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRemove}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={quantity} />
      <button
        type="submit"
        disabled={isLoading}
        className="text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors relative"
        title="Remove from cart"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Trash2 className="w-5 h-5" />
        )}
        <span className="sr-only">
          {isLoading ? "Removing..." : `Remove ${itemName} from cart`}
        </span>
      </button>
    </form>
  );
}
