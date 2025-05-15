import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const rawPath = url.pathname;

  // ✅ Hostname
  const hostname = request.headers.get('host') || '';

  // ✅ Normalize the path
  const normalizedPath =
    rawPath.toLowerCase().split('?')[0].split('#')[0].replace(/\/+/g, '/').replace(/\/$/, '') || '/';

  // ✅ Redirect www. to non-www (excluding localhost, custom internal domains etc.)
  if (hostname.startsWith('www.') && !hostname.includes('localhost')) {
    const nonWwwHost = hostname.replace(/^www\./, '');
    const redirectUrl = `https://${nonWwwHost}${normalizedPath}${url.search}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  // ✅ Add normalized path to request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-route-path', normalizedPath);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // ✅ Set cookie for use in client if needed
  response.cookies.set('current-path', normalizedPath, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return response;
}
