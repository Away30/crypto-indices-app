import { NextRequest, NextResponse } from 'next/server';
import { coinAPIClient } from '@/lib/api/coinapi';
import { cacheManager } from '@/lib/cache';
import { HistoricalData } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'BTC';
  const days = parseInt(searchParams.get('days') || '30');

  const cacheKey = `historical-${symbol}-${days}`;

  try {
    // Check cache first
    const cachedData = cacheManager.get<HistoricalData[]>(cacheKey);
    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
        rateLimitInfo: coinAPIClient.getRateLimitInfo()
      });
    }

    // Fetch fresh data
    const result = await coinAPIClient.getHistoricalData(symbol, days);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Cache the result
    if (result.data) {
      cacheManager.set(cacheKey, result.data);
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      cached: false,
      rateLimitInfo: coinAPIClient.getRateLimitInfo()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}