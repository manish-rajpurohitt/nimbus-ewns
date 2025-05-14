import { cookies } from "next/headers";
import { post, get } from "@/lib/api";
import { headers } from "next/headers";

// Server-side validation
export async function validateAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("_et");

    if (!token?.value) {
      return null;
    }

    const res = await get("/website/user/validate", {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    if (!res.isSuccess) {
      // Only modify cookies in server actions
      const headersList = await headers();
      const path = headersList.get("x-invoke-path");
      if (path?.startsWith("/api/")) {
        cookieStore.delete("_et");
      }
      return null;
    }

    return res.data;
  } catch (error) {
    // console.error("Auth validation error:", error);
    // Only modify cookies in server actions
    const headersList = await headers();
    const path = headersList.get("x-invoke-path");
    if (path?.startsWith("/api/")) {
      (await cookies()).delete("_et");
    }
    return null;
  }
}

// Server action for login
export async function loginUser(email: string, password: string) {
  try {
    const res: any = await post("/website/login", { email, password });

    if (res.isSuccess && res.data?.token) {
      // Set cookie in server action
      (await cookies()).set("_et", res.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24
      });
      return { success: true, data: res.data };
    }

    return { success: false, error: res.message };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Login failed"
    };
  }
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string
) {
  try {
    const res = (await post("/website/register", {
      fullName,
      email,
      password
    })) as { isSuccess: boolean; message: string };
    return { success: res.isSuccess, message: res.message };
  } catch (error) {
    return { success: false, message: "Registration failed", error };
  }
}

// Server action for logout
export async function logoutUser() {
  "use server";

  try {
    (await cookies()).delete("_et");
    return { success: true };
  } catch (error) {
    // console.error("Logout error:", error);
    return { success: false };
  }
}
