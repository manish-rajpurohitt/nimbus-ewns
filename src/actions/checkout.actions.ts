"use server";

import { cookies } from "next/headers";
import { get, post } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function getDeliveryCharges(addressId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    const res: any = await get(`/website/delivery/charges?addressId=${addressId}`, {
      headers: { Authorization: `Bearer ${token?.value}` }
    });

    console.log("Delivery charges response:", res);

    // Return delivery charges in correct format
    if (res.isSuccess && res.data) {
      return typeof res.data.charges === "number" ? res.data.charges : 0;
    }
    return 0;
  } catch (error) {
    console.error("Delivery charges error:", error);
    return 0;
  }
}

export async function getPaymentMethods() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    // Match reference implementation exactly
    const res = await get(`/website/payment/methods`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Raw payment methods response:", res);

    // Match reference error handling
    if (!res.isSuccess) {
      console.log("Payment methods API failed, using defaults");
      return ["COD", "Razor Pay"];
    }

    // Return data in the same format as reference
    return res.data || ["COD"];
  } catch (error) {
    console.error("Payment methods error:", error);
    return ["COD", "Razor Pay"];
  }
}

export async function placeOrder(formData: FormData) {
  try {
    const addressId = formData.get("addressId");
    const paymentMethod = formData.get("paymentMethod");

    if (!addressId || !paymentMethod) {
      return { success: false, error: "Missing required fields" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    // Match reference implementation exactly
    const res = await post(
      `/website/order?addressId=${addressId}&paymentMethod=${paymentMethod}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token?.value}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Order creation response:", res);

    if (!res.isSuccess) {
      return { success: false, error: res.message || "Failed to place order" };
    }

    revalidatePath("/orders");
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Place order error:", error);
    return { success: false, error: "Failed to place order" };
  }
}
