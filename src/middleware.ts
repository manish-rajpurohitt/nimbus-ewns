import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)',
    '/_next/data/:path*'
  ],
};

export async function middleware(request: NextRequest) {
  console.log("-----------------------------------------------------------------")


  const url = request.nextUrl;
  const rawPath = url.pathname.toLowerCase().replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
  // Add x-route-path header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-route-path', rawPath);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  let token = request.cookies.get('access_token')?.value;

  if (!token) {
    try {
      const domain = request.headers.get('host') || 'kjsdental.co.in'; // fallback domain
      const apiUrl = `https://api.ewns.in/api/website/getVisitorToken?domainName=${domain}`;

      const apiRes = await fetch(apiUrl, { method: 'GET' });

      if (apiRes.ok) {

        const data = await apiRes.json();
        console.log(typeof data, data);

        token = data?.data?.token;

        if (token) {
          response.cookies.set('access_token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60, // 1 hour
          });
        }
      } else {
        console.error('Failed to fetch token from backend:', apiRes.status);
      }
    } catch (error) {
      console.error('Token fetch error:', error);
    }
  }

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
