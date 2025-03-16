import { registerUser } from "@/utils/auth.utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const fullName = formData.get("fullName") as string;

        const result: any = await registerUser(fullName, email, password);

        if (result.success) {
            return NextResponse.redirect(new URL("/", request.url), {
                status: 302
            });
        }

        const errorMessage = encodeURIComponent(result.error || "Register failed");
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
