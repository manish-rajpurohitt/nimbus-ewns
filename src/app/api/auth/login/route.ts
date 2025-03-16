import { loginUser } from "@/utils/auth.utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await loginUser(email, password);

    if (result.success) {
      return NextResponse.redirect(new URL("/", request.url), {
        status: 302
      });
    }

    const errorMessage = encodeURIComponent(result.error || "Login failed");
    return NextResponse.redirect(
      new URL(`/login?error=${errorMessage}`, request.url),
      { status: 302 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.redirect(
      new URL("/login?error=Internal server error", request.url),
      { status: 302 }
    );
  }
}
