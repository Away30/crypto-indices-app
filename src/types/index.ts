export interface CryptoIndex {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
}

export interface TechnicalIndicator {
  indicator: string;
  value: number;
  timestamp: string;
  signal?: 'BUY' | 'SELL' | 'NEUTRAL';
}

export interface HistoricalData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
}

export interface RateLimitInfo {
  requestsRemaining: number;
  resetTime: number;
}

export interface WebSocketMessage {
  type: 'price_update' | 'indicator_update' | 'error';
  data: any;
  timestamp: string;
}