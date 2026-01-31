import { NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/token-cache';

/**
 * API endpoint to check token cache statistics
 * Access at: http://localhost:3000/api/cache-stats
 */
export async function GET() {
  try {
    const stats = getCacheStats();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cache: stats
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve cache stats'
    }, { status: 500 });
  }
}
