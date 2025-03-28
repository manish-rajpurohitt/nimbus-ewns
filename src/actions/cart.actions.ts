"use server";

import { cookies } from "next/headers";
import { get, post, put } from "@/lib/api";
import { validateAuth } from "@/utils/auth.utils";
import { revalidatePath } from "next/cache";

export async function getCart() {
  try {
    const user = await validateAuth();
    if (!user) {
      // console.log("Get cart: No authenticated user");
      return null;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    if (!token?.value) {
      // console.log("Get cart: No auth token");
      return null;
    }

    const res = await get("/website/cart", {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    if (!res.isSuccess) {
      // console.log("Get cart failed:", res.message);
      return null;
    }

    return res.data;
  } catch (error) {
    // console.error("Get cart error:", error);
    return null;
  }
}

export async function addToCart(formData: FormData): Promise<any> {
  try {
    const productId = formData.get("productId");
    const quantity = Number(formData.get("quantity")) || 1;

    // console.log("Add to cart validation:", {
    //   productId,
    //   quantity,
    //   formData: Object.fromEntries(formData)
    // });

    if (!productId || typeof productId !== "string") {
      console.error("Add to cart failed: Invalid productId", productId);
      return { success: false, error: "Invalid product" };
    }

    const user = await validateAuth();
    if (!user) {
      console.log("Add to cart failed: User not authenticated");
      return { success: false, error: "Please login to add items to cart" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    // console.log("Sending cart request:", { productId, quantity });

    const res = await post(
      "/website/cart",
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token?.value}`
        }
      }
    );

    // console.log("Cart response:", res);

    if (!res.isSuccess) {
      console.error("Add to cart failed:", res.message);
      return { success: false, error: res.message || "Failed to add item" };
    }

    // Revalidate all necessary paths
    revalidatePath("/cart");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

export async function removeFromCart(formData: FormData) {
  try {
    const user = await validateAuth();
    if (!user) {
      console.log("Remove from cart failed: User not authenticated");
      return { success: false, error: "Please login first" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    if (!token?.value) {
      console.log("Remove from cart failed: No auth token");
      return { success: false, error: "Authentication required" };
    }

    const productId = formData.get("productId");
    const quantity = Number(formData.get("quantity"));

    console.log("Removing from cart:", { productId, quantity });

    // Changed to PUT method to match reference implementation
    const res = await put(
      "/website/cart/remove",
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    );

    // console.log("Remove cart response:", res);

    if (!res.isSuccess) {
      console.error("Remove from cart failed:", res.message);
      return { success: false, error: "Unable to remove products" };
    }

    revalidatePath("/cart");
    revalidatePath("/");

    return { success: true, data: res.data };
  } catch (error) {
    console.error("Remove from cart error:", error);
    return { success: false, error: "Unable to remove products" };
  }
}
