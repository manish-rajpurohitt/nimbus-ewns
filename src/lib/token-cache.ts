/**
 * Token Cache Utility
 * Provides in-memory caching for visitor tokens by domain name
 * Reduces API calls and improves performance for multi-tenant architecture
 */

interface TokenCacheEntry {
  token: string;
  timestamp: number;
  businessId?: string;
}

interface TokenCache {
  [domainName: string]: TokenCacheEntry;
}

// In-memory cache for tokens
const tokenCache: TokenCache = {};

// Pending token fetch promises (prevents duplicate requests)
const pendingFetches = new Map<string, Promise<string | null>>();

// Cache TTL configuration (30 minutes default)
const CACHE_TTL = parseInt(process.env.TOKEN_CACHE_TTL || '1800000', 10); // 30 minutes in ms
const MAX_CACHE_SIZE = parseInt(process.env.MAX_CACHE_SIZE || '1000', 10);

/**
 * Get cached token for a domain
 */
export function getCachedToken(domainName: string): string | null {
  const normalizedDomain = normalizeDomain(domainName);
  const entry = tokenCache[normalizedDomain];

  if (!entry) {
    console.log(`[Token Cache] ❌ MISS for domain: ${normalizedDomain}`);
    return null;
  }

  // Check if cache is still valid
  const now = Date.now();
  const age = now - entry.timestamp;

  if (age > CACHE_TTL) {
    // Cache expired, remove it
    delete tokenCache[normalizedDomain];
    console.log(`[Token Cache] ⏰ EXPIRED for domain: ${normalizedDomain} (age: ${Math.round(age / 1000)}s)`);
    return null;
  }

  console.log(`[Token Cache] ✅ HIT for domain: ${normalizedDomain} (age: ${Math.round(age / 1000)}s)`);
  return entry.token;
}

/**
 * Set token in cache for a domain
 */
export function setCachedToken(
  domainName: string,
  token: string,
  businessId?: string
): void {
  const normalizedDomain = normalizeDomain(domainName);

  // Implement simple LRU by removing oldest entry if cache is full
  if (Object.keys(tokenCache).length >= MAX_CACHE_SIZE) {
    const oldestDomain = Object.keys(tokenCache).reduce((oldest, domain) => {
      if (!oldest || tokenCache[domain].timestamp < tokenCache[oldest].timestamp) {
        return domain;
      }
      return oldest;
    }, '');

    if (oldestDomain) {
      console.log(`[Token Cache] 🗑️ Evicting oldest entry: ${oldestDomain}`);
      delete tokenCache[oldestDomain];
    }
  }

  console.log(`[Token Cache] 💾 STORED for domain: ${normalizedDomain} (businessId: ${businessId || 'N/A'})`);
  tokenCache[normalizedDomain] = {
    token,
    timestamp: Date.now(),
    businessId
  };
}

/**
 * Invalidate cache for a specific domain
 */
export function invalidateCache(domainName: string): void {
  const normalizedDomain = normalizeDomain(domainName);
  delete tokenCache[normalizedDomain];
}

/**
 * Clear all cached tokens
 */
export function clearAllCache(): void {
  Object.keys(tokenCache).forEach(key => delete tokenCache[key]);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const now = Date.now();
  const entries = Object.entries(tokenCache);
  
  return {
    totalEntries: entries.length,
    validEntries: entries.filter(([_, entry]) => (now - entry.timestamp) <= CACHE_TTL).length,
    expiredEntries: entries.filter(([_, entry]) => (now - entry.timestamp) > CACHE_TTL).length,
    cacheSize: MAX_CACHE_SIZE,
    cacheTTL: CACHE_TTL,
    domains: entries.map(([domain, entry]) => ({
      domain,
      age: now - entry.timestamp,
      isValid: (now - entry.timestamp) <= CACHE_TTL
    }))
  };
}

/**
 * Normalize domain name for consistent caching
 */
function normalizeDomain(domainName: string): string {
  if (!domainName) {
    return process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || process.env.DEFAULT_DOMAIN;
  }

  return domainName
    .toLowerCase()
    .replace(/^www\./, '') // Remove www
    .replace(/:\d+$/, '') // Remove port
    .trim();
}

/**
 * Batch fetch tokens for multiple domains (useful for preloading)
 * Now with request deduplication
 */
export async function batchFetchTokens(
  domains: string[],
  fetchFn: (domain: string) => Promise<string | null>
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  await Promise.allSettled(
    domains.map(async (domain) => {
      const normalizedDomain = normalizeDomain(domain);
      
      // Check cache first
      const cached = getCachedToken(normalizedDomain);
      if (cached) {
        results.set(normalizedDomain, cached);
        return;
      }

      // Check if there's already a pending fetch for this domain
      let fetchPromise = pendingFetches.get(normalizedDomain);
      
      if (!fetchPromise) {
        // Create new fetch promise
        fetchPromise = fetchFn(normalizedDomain).finally(() => {
          // Clean up pending fetch after it completes
          pendingFetches.delete(normalizedDomain);
        });
        pendingFetches.set(normalizedDomain, fetchPromise);
      }

      // Fetch and cache
      try {
        const token = await fetchPromise;
        if (token) {
          setCachedToken(normalizedDomain, token);
          results.set(normalizedDomain, token);
        }
      } catch (error) {
        console.error(`Failed to fetch token for ${normalizedDomain}:`, error);
      }
    })
  );

  return results;
}

/**
 * Get or fetch token with deduplication
 * This prevents multiple simultaneous fetches for the same domain
 */
export async function getOrFetchToken(
  domain: string,
  fetchFn: (domain: string) => Promise<string | null>
): Promise<string | null> {
  // Return null early if domain is undefined/null/empty - no API call needed
  if (!domain) {
    console.log(`[Token Cache] ⚠️ Domain is undefined/null/empty - skipping API call`);
    return null;
  }
  
  const normalizedDomain = normalizeDomain(domain);
  
  // Check cache first
  const cached = getCachedToken(normalizedDomain);
  if (cached) {
    return cached;
  }

  // Check if there's already a pending fetch for this domain
  let fetchPromise = pendingFetches.get(normalizedDomain);
  
  if (!fetchPromise) {
    console.log(`[Token Cache] 🔄 Starting new fetch for domain: ${normalizedDomain}`);
  getOrFetchToken,
    // Create new fetch promise
    fetchPromise = fetchFn(normalizedDomain).finally(() => {
      // Clean up pending fetch after it completes
      pendingFetches.delete(normalizedDomain);
    });
    pendingFetches.set(normalizedDomain, fetchPromise);
  } else {
    console.log(`[Token Cache] ⏳ Waiting for existing fetch for domain: ${normalizedDomain}`);
  }

  // Wait for fetch to complete
  const token = await fetchPromise;
  
  if (token) {
    setCachedToken(normalizedDomain, token);
  }
  
  return token;
}

/**
 * Cleanup expired entries periodically
 */
export function cleanupExpiredEntries(): number {
  const now = Date.now();
  let cleaned = 0;

  Object.entries(tokenCache).forEach(([domain, entry]) => {
    if (now - entry.timestamp > CACHE_TTL) {
      delete tokenCache[domain];
      cleaned++;
    }
  });

  return cleaned;
}

// Global flag to prevent multiple cleanup intervals
let cleanupIntervalStarted = false;

// Run cleanup every 10 minutes in production
// IMPORTANT: Only start ONE interval across all module loads
if (process.env.NODE_ENV === 'production' && !cleanupIntervalStarted) {
  cleanupIntervalStarted = true;
  setInterval(() => {
    const cleaned = cleanupExpiredEntries();
    if (cleaned > 0) {
      console.log(`[Token Cache] Cleaned up ${cleaned} expired entries`);
    }
  }, 600000); // 10 minutes
  console.log('[Token Cache] Cleanup interval started (once)');
}

export default {
  getCachedToken,
  setCachedToken,
  invalidateCache,
  clearAllCache,
  getCacheStats,
  batchFetchTokens,
  cleanupExpiredEntries
};
