import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|.*\\..*).*)',
    '/_next/data/:path*'
  ],
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const rawPath = url.pathname.toLowerCase().replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
  
  // Early exit for static assets - don't run middleware logic
  if (/\.(ico|png|jpg|jpeg|webp|svg|css|js|woff2?|json|xml|txt)$/i.test(rawPath)) {
    return NextResponse.next();
  }

  // Skip middleware for Next.js internals
  if (rawPath.startsWith('/_next/') || rawPath.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Add x-route-path header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-route-path', rawPath);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  let token = request.cookies.get('access_token')?.value;

  // Only fetch token if missing, with timeout and error handling
  if (!token) {
    try {
      const domain = request.headers.get('host') || 'kjsdental.co.in';
      const apiUrl = `https://api.ewns.in/api/website/getVisitorToken?domainName=${domain}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const apiRes = await fetch(apiUrl, { 
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store'
      });

      clearTimeout(timeoutId);

      if (apiRes.ok) {
        const data = await apiRes.json();
        token = data?.data?.token;

        if (token) {
          response.cookies.set('access_token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600, // 1 hour
          });
        }
      }
    } catch (error) {
      // Silently fail - allow request to continue without token
      console.error('Token fetch error:', error);
    }
  }

  // Redirect www to non-www
  const hostname = url.hostname;
  if (hostname.startsWith('www.') && !hostname.includes('localhost')) {
    const nonWwwHost = hostname.replace(/^www\./, '');
    const redirectUrl = `https://${nonWwwHost}${rawPath}${url.search}`;
    return NextResponse.redirect(redirectUrl, 301);
  }




  // Set current path cookie if changed
  if (request.cookies.get('current-path')?.value !== rawPath) {
    response.cookies.set('current-path', rawPath, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  // Check access_token


  return response;
}
