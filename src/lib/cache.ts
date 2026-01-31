import { cookies } from 'next/headers';

// In-memory cache with TTL per domain
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number;
};

// Pending requests for deduplication
type PendingRequest<T> = Promise<T>;

// Use global to persist cache across hot reloads in development
const globalForCache = globalThis as unknown as {
  cache: Map<string, CacheEntry<any>>;
  pendingRequests: Map<string, PendingRequest<any>>;
};

if (!globalForCache.cache) {
  globalForCache.cache = new Map<string, CacheEntry<any>>();
}

if (!globalForCache.pendingRequests) {
  globalForCache.pendingRequests = new Map<string, PendingRequest<any>>();
}

const cache = globalForCache.cache;
const pendingRequests = globalForCache.pendingRequests;

/**
 * Domain-aware cache wrapper for multi-tenant architecture
 * Caches data per domain using access_token as cache key
 * Uses in-memory cache with TTL to avoid Next.js cache limitations
 */
export async function cacheByDomain<T>(
  fn: () => Promise<T>,
  keys: string[],
  options: {
    revalidate?: number;
    tags?: string[];
  } = {}
): Promise<T> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value || 'default';
    
    // Create domain-specific cache key
    const cacheKey = `${accessToken}:${keys.join(':')}`;
    const ttl = (options.revalidate || 300) * 1000; // Convert to milliseconds
    
    // Check if we have valid cached data
    const cached = cache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < cached.ttl) {
      // Cache hit - return cached data
      console.log(`[Cache HIT] Key: ${keys.join(':')} | Cache Size: ${cache.size} items | Age: ${Math.round((now - cached.timestamp) / 1000)}s`);
      return cached.data;
    }
    
    // Check if there's a pending request for this key (request deduplication)
    const pending = pendingRequests.get(cacheKey);
    if (pending) {
      console.log(`[Cache DEDUP] Key: ${keys.join(':')} | Waiting for pending request...`);
      return await pending;
    }
    
    // Cache miss - fetch fresh data
    console.log(`[Cache MISS] Key: ${keys.join(':')} | Cache Size: ${cache.size} items | Fetching fresh data...`);
    
    // Create and store pending request
    const fetchPromise = fn().then((data) => {
      // Store in cache with timestamp
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl
      });
      
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
      
      console.log(`[Cache STORED] Key: ${keys.join(':')} | Cache Size: ${cache.size} items | TTL: ${options.revalidate || 300}s`);
      
      return data;
    }).catch((error) => {
      // Remove from pending requests on error
      pendingRequests.delete(cacheKey);
      throw error;
    });
    
    pendingRequests.set(cacheKey, fetchPromise);
    const data = await fetchPromise;
    
    // Clean up old cache entries (simple LRU-like behavior)
    if (cache.size > 1000) {
      const oldestKeys = Array.from(cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, 100)
        .map(([key]) => key);
      
      oldestKeys.forEach(key => cache.delete(key));
      console.log(`[Cache CLEANUP] Removed ${oldestKeys.length} old entries | Cache Size: ${cache.size} items`);
    }
    
    return data;
  } catch (error) {
    // If caching fails, execute function directly
    console.error('[Cache] Error in cacheByDomain, executing directly:', error);
    return await fn();
  }
}

/**
 * Shorter revalidation for frequently changing content
 */
export async function cacheByDomainShort<T>(
  fn: () => Promise<T>,
  keys: string[]
): Promise<T> {
  return cacheByDomain(fn, keys, { revalidate: 180 }); // 3 minutes
}

/**
 * Longer revalidation for static content
 */
export async function cacheByDomainLong<T>(
  fn: () => Promise<T>,
  keys: string[]
): Promise<T> {
  return cacheByDomain(fn, keys, { revalidate: 600 }); // 10 minutes
}
