import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get full URL object
  const url = request.nextUrl;
  const rawPath = url.pathname;

  // Normalize the path
  const normalizedPath =
    rawPath
      .toLowerCase()
      .split("?")[0]
      .split("#")[0]
      .replace(/\/+/g, "/")
      .replace(/\/$/, "") || "/";

  // Create headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-route-path", normalizedPath);

  // Set path state in a cookie for client-side consistency
  const response = NextResponse.next({
    request: { headers: requestHeaders }
  });

  // Set cookie with current path for client-side access
  response.cookies.set("current-path", normalizedPath, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)"
  ]
};
