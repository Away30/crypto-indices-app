import { NextRequest, NextResponse } from 'next/server';
import { coinAPIClient } from '@/lib/api/coinapi';
import { cacheManager } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const rateLimitInfo = coinAPIClient.getRateLimitInfo();
    const cacheStats = cacheManager.getStats();

    return NextResponse.json({
      success: true,
      data: {
        rateLimit: rateLimitInfo,
        cache: cacheStats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Status API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}