# Multi-Tenant Caching Strategy

## Problem
Traditional ISR (Incremental Static Regeneration) doesn't work for multi-tenant applications because Next.js caches pages by URL path only, not by domain. This causes domain A's content to be served to domain B.

## Solution: Domain-Aware Data Caching

We implemented **data-level caching** instead of page-level caching using Next.js 15's `unstable_cache` API with domain-specific cache keys.

### How It Works

1. **Domain Identification**: Each domain gets a unique `access_token` cookie via middleware
2. **Cache Segmentation**: Cache keys include the access_token, ensuring each domain has separate cached data
3. **Automatic Revalidation**: Cached data is automatically refreshed in the background

### Implementation

```typescript
// lib/cache.ts - Domain-aware cache wrapper
export async function cacheByDomain<T>(
  fn: () => Promise<T>,
  keys: string[],
  options: { revalidate?: number; tags?: string[] }
): Promise<T> {
  const accessToken = cookies().get('access_token')?.value || 'default';
  const cacheKey = [accessToken, ...keys]; // Domain-specific key
  
  const cachedFn = unstable_cache(fn, cacheKey, {
    revalidate: options.revalidate || 300,
    tags: options.tags || [],
  });
  
  return cachedFn();
}
```

### Usage

```typescript
// Before (No caching - high memory usage)
export async function fetchBusinessData() {
  const response = await get("/website/getBusinessDetails");
  return response;
}

// After (Domain-aware caching)
export async function fetchBusinessData() {
  return cacheByDomain(
    async () => {
      const response = await get("/website/getBusinessDetails");
      return response;
    },
    ['business-data'],
    { revalidate: 300 } // 5 minutes
  );
}
```

## Benefits

✅ **Reduced Memory Usage**: Data is cached and reused across requests  
✅ **Lower Server Load**: Fewer database queries and API calls  
✅ **Multi-Tenant Safe**: Each domain gets its own cached data  
✅ **Automatic Background Updates**: Fresh data without user waiting  
✅ **Better Performance**: Sub-second response times for cached data  

## Revalidation Times

| Content Type | Revalidation | Function |
|-------------|-------------|----------|
| Products, Homepage | 3 minutes (180s) | `cacheByDomainShort()` |
| Services, Teams, Blogs | 5 minutes (300s) | `cacheByDomain()` |
| About, Contact, Address | 10 minutes (600s) | `cacheByDomainLong()` |

## Cache Invalidation

To manually invalidate cache for a specific domain:

```typescript
import { revalidateTag } from 'next/cache';

// Invalidate all business data
revalidateTag('business');

// Invalidate all services
revalidateTag('services');
```

## Monitoring

Check cache effectiveness in production:
- Monitor memory usage - should stay stable
- Check response times - should improve significantly
- Verify domain isolation - each domain sees correct content

## Important Notes

⚠️ **Do NOT use page-level ISR** (`export const revalidate = 180`) in multi-tenant setup  
✅ **Use data-level caching** with `cacheByDomain()` instead  
✅ **User-specific pages** (profile, cart, orders) should NOT be cached  
✅ **Always test** with multiple domains to ensure isolation  
