import { logoutUser } from "@/utils/auth.utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await logoutUser();
    return NextResponse.redirect(new URL("/", request.url), {
      status: 302
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/", request.url), {
      status: 302
    });
  }
}
