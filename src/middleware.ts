import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const rawPath = url.pathname.toLowerCase().replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';

  // Early exit for static assets
  if (/\.(ico|png|jpg|jpeg|webp|svg|css|js|woff2?)$/i.test(rawPath)) {
    return NextResponse.next();
  }

  // Redirect www to non-www
  const hostname = url.hostname;
  if (hostname.startsWith('www.') && !hostname.includes('localhost')) {
    const nonWwwHost = hostname.replace(/^www\./, '');
    const redirectUrl = `https://${nonWwwHost}${rawPath}${url.search}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Add x-route-path header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-route-path', rawPath);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Only set cookie if value changed
  if (request.cookies.get('current-path')?.value !== rawPath) {
    response.cookies.set('current-path', rawPath, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  return response;
}
