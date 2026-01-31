import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOrFetchToken } from '@/lib/token-cache';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|.*\\..*).*)',
    '/_next/data/:path*'
  ],
};

/**
 * Fetch visitor token for a domain (used by getOrFetchToken)
 */
async function fetchVisitorTokenFromAPI(domain: string): Promise<string | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ewns.in/api';
  
  console.log(`[Middleware] 🌐 Fetching token from API for domain: ${domain}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

  try {
    const apiRes = await fetch(
      `${API_BASE_URL}/website/getVisitorToken?domainName=${domain}`,
      {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
        // Use Next.js fetch caching
        next: { revalidate: 1800 } // Cache for 30 minutes
      }
    );

    clearTimeout(timeoutId); // Clear timeout on success

    if (apiRes.ok) {
      const data = await apiRes.json();
      const token = data?.data?.token;
      
      if (token) {
        console.log(`[Middleware] ✅ Token fetched successfully for domain: ${domain}`);
        return token;
      }
    }
    
    console.log(`[Middleware] ❌ Failed to fetch token for domain: ${domain}`);
    return null;
  } catch (error) {
    clearTimeout(timeoutId); // CRITICAL: Clear timeout on error to prevent zombie timer
    console.error(`[Middleware] 🔥 Token fetch error for ${domain}:`, error);
    return null;
  }
}

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
  
  // Get domain from request - use full host with port for localhost
  let domain = request.headers.get('host') || process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || process.env.DEFAULT_DOMAIN;
  
  // For localhost, always use the default domain for token fetching
  if (domain.includes('localhost')) {
    domain = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || process.env.DEFAULT_DOMAIN;
  }

  
  // Check if token exists in cookies
  let token: string | null | undefined = request.cookies.get('access_token')?.value;

  // If no token in cookies, use getOrFetchToken for deduplication
  if (!token) {
    token = await getOrFetchToken(domain, fetchVisitorTokenFromAPI);
    
    // Set token in cookie if we have it
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

  return response;
}
