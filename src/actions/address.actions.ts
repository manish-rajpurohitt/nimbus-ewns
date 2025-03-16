"use server";

import { cookies } from "next/headers";
import { get, post, put, del } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function getAddresses() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    const res = await get("/website/address/getAll", {
      headers: { Authorization: `Bearer ${token?.value}` }
    });

    console.log("Raw address response:", res);

    // Return raw data instead of wrapping it
    if (!res.isSuccess) {
      return [];
    }

    return res.data;
  } catch (error) {
    console.error("Get addresses error:", error);
    return [];
  }
}

export async function addAddress(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    // Send the raw form data directly
    const payload = Object.fromEntries(formData);

    console.log("Sending address payload:", payload);

    const res = await post("/website/address", payload, {
      headers: { Authorization: `Bearer ${token?.value}` }
    });

    console.log("Add address response:", res);

    if (!res.isSuccess) {
      return { success: false, error: res.message };
    }

    revalidatePath("/address");
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Add address error:", error);
    return { success: false, error: "Failed to add address" };
  }
}

export async function updateAddress(addressId: string, formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    const addressData = {
      address: {
        name: formData.get("name"),
        phoneNumber: formData.get("phoneNumber"),
        addressLine1: formData.get("addressLine1"),
        addressLine2: formData.get("addressLine2") || "",
        city: formData.get("city"),
        state: formData.get("state"),
        country: formData.get("country") || "India",
        pincode: formData.get("pincode"),
        landmark: formData.get("landmark") || ""
      }
    };

    const res = await put(`/website/address/${addressId}`, addressData, {
      headers: { Authorization: `Bearer ${token?.value}` }
    });

    if (!res.isSuccess) {
      throw new Error(res.message);
    }

    revalidatePath("/address");
    return { success: true };
  } catch (error) {
    console.error("Update address error:", error);
    return { success: false, error: "Failed to update address" };
  }
}

export async function getAddress(addressId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    const res = await get(`/website/address/get?addressId=${addressId}`, {
      headers: { Authorization: `Bearer ${token?.value}` }
    });

    if (!res.isSuccess) {
      throw new Error(res.message);
    }

    return { success: true, data: res.data };
  } catch (error) {
    console.error("Get address error:", error);
    return { success: false, error: "Failed to fetch address" };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    const res = await del(`/website/address/${addressId}`, {
      config: {
        headers: { Authorization: `Bearer ${token?.value}` }
      }
    });

    console.log("Delete address response:", res);

    revalidatePath("/address");
    return { success: true };
  } catch (error) {
    console.error("Delete address error:", error);
    return { success: false };
  }
}

export async function getPincodeDetails(pincode: string) {
  try {
    const res = await get(`/website/address/getPincode?pincode=${pincode}`);
    console.log("Pincode lookup response:", res);
    return res.isSuccess
      ? { success: true, data: res.data }
      : { success: false, error: res.message };
  } catch (error) {
    console.error("Pincode lookup error:", error);
    return { success: false, error: "Failed to fetch pincode details" };
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    if (!token?.value) {
      return { success: false, error: "Authentication required" };
    }

    const res = await put(
      "/website/address/setDefault",
      { addressId },
      { headers: { Authorization: `Bearer ${token.value}` } }
    );

    if (!res.isSuccess) {
      return { success: false, error: res.message };
    }

    revalidatePath("/address");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to set default address" };
  }
}
