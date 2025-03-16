"use client";

import { useTransition } from "react";
import { addToCart } from "@/actions/cart.actions";
import { MinusCircle, PlusCircle } from "lucide-react";

export default function CartQuantityForm({ item }: { item: any }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form className="flex items-center gap-3">
      <input type="hidden" name="productId" value={item.productId} />

      <button
        type="button"
        disabled={item.quantity <= 1 || isPending}
        onClick={() => {
          const formData = new FormData();
          formData.set("productId", item.productId);
          formData.set("quantity", "-1");
          startTransition(() => addToCart(formData));
        }}
        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        <MinusCircle className="w-5 h-5" />
      </button>

      <span className="w-8 text-center">
        {isPending ? "..." : item.quantity}
      </span>

      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          const formData = new FormData();
          formData.set("productId", item.productId);
          formData.set("quantity", "1");
          startTransition(() => addToCart(formData));
        }}
        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        <PlusCircle className="w-5 h-5" />
      </button>
    </form>
  );
}
