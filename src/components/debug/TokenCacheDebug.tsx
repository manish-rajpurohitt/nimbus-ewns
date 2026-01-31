'use client';

import { useEffect, useState } from 'react';

interface CacheStats {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  cacheSize: number;
  cacheTTL: number;
  domains: Array<{
    domain: string;
    age: number;
    isValid: boolean;
  }>;
}

/**
 * Token Cache Debug Component
 * Shows real-time cache statistics
 * Add this to your page to monitor caching: <TokenCacheDebug />
 */
export default function TokenCacheDebug() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/cache-stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.cache);
        setError(null);
      } else {
        setError('Failed to load cache stats');
      }
    } catch (err) {
      setError('Error fetching cache stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh every 5 seconds
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm font-medium z-50"
        title="Show cache statistics"
      >
        📊 Cache Stats
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-2xl p-4 max-w-md z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800">Token Cache Statistics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {stats && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-green-50 p-2 rounded">
              <div className="text-green-600 font-semibold">Total Entries</div>
              <div className="text-2xl font-bold text-green-700">{stats.totalEntries}</div>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <div className="text-blue-600 font-semibold">Valid Entries</div>
              <div className="text-2xl font-bold text-blue-700">{stats.validEntries}</div>
            </div>
            <div className="bg-yellow-50 p-2 rounded">
              <div className="text-yellow-600 font-semibold">Expired</div>
              <div className="text-2xl font-bold text-yellow-700">{stats.expiredEntries}</div>
            </div>
            <div className="bg-purple-50 p-2 rounded">
              <div className="text-purple-600 font-semibold">Max Size</div>
              <div className="text-2xl font-bold text-purple-700">{stats.cacheSize}</div>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            <strong>Cache TTL:</strong> {Math.round(stats.cacheTTL / 1000 / 60)} minutes
          </div>

          {stats.domains.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold text-sm mb-2">Cached Domains:</h4>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {stats.domains.map((domain, idx) => (
                  <div
                    key={idx}
                    className={`text-xs p-2 rounded ${
                      domain.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}
                  >
                    <div className="font-medium truncate">{domain.domain}</div>
                    <div className="text-xs opacity-75">
                      Age: {Math.round(domain.age / 1000)}s {domain.isValid ? '✅' : '⏰ Expired'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={fetchStats}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors mt-2"
          >
            🔄 Refresh
          </button>
        </div>
      )}
    </div>
  );
}
