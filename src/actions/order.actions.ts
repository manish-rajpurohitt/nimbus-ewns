"use server";

import { cookies } from "next/headers";
import { get, post } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function getAllOrders() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    const res = await get("/website/order/getAll", {
      headers: { Authorization: `Bearer ${token?.value}` }
    });

    if (!res.isSuccess) {
      throw new Error(res.message);
    }

    return res.data;
  } catch (error) {
    console.error("Get orders error:", error);
    return null;
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    const res = await get(`/website/order/get?orderId=${orderId}`, {
      headers: { Authorization: `Bearer ${token?.value}` }
    });

    if (!res.isSuccess) {
      throw new Error(res.message);
    }

    return res.data;
  } catch (error) {
    console.error("Get order details error:", error);
    return null;
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    const res = await post(
      `/website/order/cancel?orderId=${orderId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token?.value}` }
      }
    );

    if (!res.isSuccess) {
      throw new Error(res.message);
    }

    revalidatePath("/orders");
    revalidatePath(`/order/${orderId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to cancel order" };
  }
}
