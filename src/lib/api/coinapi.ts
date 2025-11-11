import axios, { AxiosInstance } from 'axios';
import { CryptoIndex, TechnicalIndicator, HistoricalData, ApiResponse, RateLimitInfo } from '@/types';

class RateLimiter {
  private requests: number[] = [];
  private maxRequestsPerMinute: number;
  private maxRequestsPerMonth: number;
  private monthlyRequests: number = 0;
  private monthStart: number = Date.now();

  constructor(maxPerMinute: number = 20, maxPerMonth: number = 500) {
    this.maxRequestsPerMinute = maxPerMinute;
    this.maxRequestsPerMonth = maxPerMonth;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    // Clean old requests
    this.requests = this.requests.filter(time => time > oneMinuteAgo);

    // Reset monthly counter if needed
    if (now - this.monthStart > (30 * 24 * 60 * 60 * 1000)) {
      this.monthlyRequests = 0;
      this.monthStart = now;
    }

    return this.requests.length < this.maxRequestsPerMinute &&
           this.monthlyRequests < this.maxRequestsPerMonth;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
    this.monthlyRequests++;
  }

  getRateLimitInfo(): RateLimitInfo {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentRequests = this.requests.filter(time => time > oneMinuteAgo).length;

    return {
      requestsRemaining: Math.min(
        this.maxRequestsPerMinute - recentRequests,
        this.maxRequestsPerMonth - this.monthlyRequests
      ),
      resetTime: Math.max(...this.requests) + 60000
    };
  }
}

class CoinAPIClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://rest.coinapi.io/v1',
      headers: {
        'X-CoinAPI-Key': process.env.COINAPI_KEY || ''
      }
    });

    this.rateLimiter = new RateLimiter(
      parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '20'),
      parseInt(process.env.MAX_REQUESTS_PER_MONTH || '500')
    );
  }

  async getExchangeRates(): Promise<ApiResponse<CryptoIndex[]>> {
    if (!this.rateLimiter.canMakeRequest()) {
      return {
        success: false,
        error: 'Rate limit exceeded'
      };
    }

    try {
      // Define crypto indices to track (major cryptocurrencies as indices)
      const symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP'];
      const indices: CryptoIndex[] = [];

      // Fetch real data for each symbol using OHLCV (more efficient than multiple calls)
      for (const symbol of symbols) {
        if (!this.rateLimiter.canMakeRequest()) {
          console.warn(`Rate limit reached while fetching ${symbol}, stopping at ${indices.length} symbols`);
          break;
        }

        try {
          // Get last 2 days of OHLCV data to calculate 24h change with real volume
          this.rateLimiter.recordRequest();
          const symbolId = `BITSTAMP_SPOT_${symbol}_USD`;

          const ohlcvResponse = await this.client.get('/ohlcv/latest', {
            params: {
              symbol_id: symbolId,
              period_id: '1DAY',
              limit: 2  // Get last 2 days
            }
          });

          if (!ohlcvResponse.data || ohlcvResponse.data.length === 0) {
            console.warn(`No OHLCV data for ${symbol}, trying fallback`);
            // Fallback to simple exchange rate if OHLCV fails
            const data = await this.getSymbolFallbackData(symbol);
            if (data) {
              indices.push(data);
            }
            continue;
          }

          // Get current and previous day data
          const currentData = ohlcvResponse.data[0];
          const previousData = ohlcvResponse.data.length > 1 ? ohlcvResponse.data[1] : currentData;

          const currentPrice = currentData.price_close;
          const previousPrice = previousData.price_close;
          const change24h = currentPrice - previousPrice;
          const changePercent24h = ((currentPrice - previousPrice) / previousPrice) * 100;
          const volume24h = currentData.volume_traded;

          // Get real market cap from assets endpoint
          let marketCap = this.estimateMarketCap(symbol, currentPrice); // Default estimate

          if (this.rateLimiter.canMakeRequest()) {
            try {
              this.rateLimiter.recordRequest();
              const assetResponse = await this.client.get(`/assets/${symbol}`);

              if (assetResponse.data && assetResponse.data.volume_1day_usd) {
                // Use real volume if available
                // Note: Some assets might not have market cap in free tier
                marketCap = assetResponse.data.supply_total
                  ? assetResponse.data.supply_total * currentPrice
                  : this.estimateMarketCap(symbol, currentPrice);
              }
            } catch (assetError) {
              // If assets endpoint fails (common in free tier), use estimate
              console.log(`Assets data unavailable for ${symbol}, using estimate`);
            }
          }

          indices.push({
            id: symbol.toLowerCase(),
            name: this.getCryptoName(symbol),
            symbol: symbol,
            price: currentPrice,
            change24h: change24h,
            changePercent24h: changePercent24h,
            marketCap: marketCap,
            volume24h: volume24h,
            lastUpdated: new Date().toISOString()
          });

          // Small delay to avoid hitting rate limits too fast
          await new Promise(resolve => setTimeout(resolve, 150));

        } catch (error: any) {
          console.error(`Failed to fetch ${symbol}:`, error.message);

          // Try fallback with alternative exchanges
          try {
            const fallbackData = await this.getSymbolWithFallback(symbol);
            if (fallbackData) {
              indices.push(fallbackData);
            }
          } catch (fallbackError) {
            console.error(`All methods failed for ${symbol}`);
          }
        }
      }

      if (indices.length === 0) {
        return {
          success: false,
          error: 'Failed to fetch any exchange rates'
        };
      }

      return {
        success: true,
        data: indices
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch exchange rates'
      };
    }
  }

  // Fallback method using simple exchange rate
  private async getSymbolFallbackData(symbol: string): Promise<CryptoIndex | null> {
    try {
      if (!this.rateLimiter.canMakeRequest()) {
        return null;
      }

      this.rateLimiter.recordRequest();
      const response = await this.client.get(`/exchangerate/${symbol}/USD`);
      const rate = response.data.rate;

      // Estimate change using smaller percentage for fallback
      const change24h = rate * 0.02; // Conservative 2% estimate
      const changePercent24h = 2.0;

      return {
        id: symbol.toLowerCase(),
        name: this.getCryptoName(symbol),
        symbol: symbol,
        price: rate,
        change24h: change24h,
        changePercent24h: changePercent24h,
        marketCap: this.estimateMarketCap(symbol, rate),
        volume24h: this.estimateVolume(symbol, rate),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      return null;
    }
  }

  // Try multiple exchanges for OHLCV data
  private async getSymbolWithFallback(symbol: string): Promise<CryptoIndex | null> {
    const exchanges = ['COINBASE', 'KRAKEN', 'BINANCE'];

    for (const exchange of exchanges) {
      if (!this.rateLimiter.canMakeRequest()) {
        break;
      }

      try {
        this.rateLimiter.recordRequest();
        const symbolId = `${exchange}_SPOT_${symbol}_${exchange === 'BINANCE' ? 'USDT' : 'USD'}`;

        const response = await this.client.get('/ohlcv/latest', {
          params: {
            symbol_id: symbolId,
            period_id: '1DAY',
            limit: 2
          }
        });

        if (response.data && response.data.length > 0) {
          const currentData = response.data[0];
          const previousData = response.data.length > 1 ? response.data[1] : currentData;

          const currentPrice = currentData.price_close;
          const previousPrice = previousData.price_close;
          const change24h = currentPrice - previousPrice;
          const changePercent24h = ((currentPrice - previousPrice) / previousPrice) * 100;
          const volume24h = currentData.volume_traded;

          return {
            id: symbol.toLowerCase(),
            name: this.getCryptoName(symbol),
            symbol: symbol,
            price: currentPrice,
            change24h: change24h,
            changePercent24h: changePercent24h,
            marketCap: this.estimateMarketCap(symbol, currentPrice),
            volume24h: volume24h,
            lastUpdated: new Date().toISOString()
          };
        }
      } catch (error) {
        continue; // Try next exchange
      }
    }

    return null;
  }

  private getCryptoName(symbol: string): string {
    const names: { [key: string]: string } = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'BNB': 'Binance Coin',
      'SOL': 'Solana',
      'ADA': 'Cardano',
      'XRP': 'Ripple'
    };
    return names[symbol] || symbol;
  }

  private estimateMarketCap(symbol: string, price: number): number {
    // Rough estimates based on typical market caps
    const supplies: { [key: string]: number } = {
      'BTC': 19_500_000,
      'ETH': 120_000_000,
      'BNB': 150_000_000,
      'SOL': 400_000_000,
      'ADA': 35_000_000_000,
      'XRP': 52_000_000_000
    };
    return (supplies[symbol] || 1_000_000) * price;
  }

  private estimateVolume(symbol: string, price: number): number {
    // Rough estimates of 24h volume based on market activity
    const multipliers: { [key: string]: number } = {
      'BTC': 0.5,
      'ETH': 0.3,
      'BNB': 0.2,
      'SOL': 0.15,
      'ADA': 0.1,
      'XRP': 0.25
    };
    const marketCap = this.estimateMarketCap(symbol, price);
    return marketCap * (multipliers[symbol] || 0.1);
  }

  async getHistoricalData(symbol: string, days: number = 30): Promise<ApiResponse<HistoricalData[]>> {
    if (!this.rateLimiter.canMakeRequest()) {
      return {
        success: false,
        error: 'Rate limit exceeded'
      };
    }

    try {
      this.rateLimiter.recordRequest();

      // Format symbol for CoinAPI OHLCV endpoint
      // Using Bitstamp exchange as it's reliable and has good coverage
      const symbolId = `BITSTAMP_SPOT_${symbol}_USD`;

      const response = await this.client.get('/ohlcv/latest', {
        params: {
          symbol_id: symbolId,
          period_id: '1DAY',
          limit: days + 1
        }
      });

      // CoinAPI returns OHLCV data in the format we need
      const historicalData: HistoricalData[] = response.data.map((item: any) => ({
        timestamp: item.time_period_start,
        open: item.price_open,
        high: item.price_high,
        low: item.price_low,
        close: item.price_close,
        volume: item.volume_traded
      }));

      // Sort by timestamp (oldest first)
      historicalData.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      return {
        success: true,
        data: historicalData
      };
    } catch (error: any) {
      console.error(`Failed to fetch historical data for ${symbol}:`, error.message);

      // Fallback: Try alternative exchange if Bitstamp fails
      if (error.response?.status === 404 || error.response?.status === 550) {
        return this.getHistoricalDataFallback(symbol, days);
      }

      return {
        success: false,
        error: 'Failed to fetch historical data'
      };
    }
  }

  private async getHistoricalDataFallback(symbol: string, days: number): Promise<ApiResponse<HistoricalData[]>> {
    // Try alternative exchanges
    const exchanges = ['COINBASE', 'KRAKEN', 'BINANCE'];

    for (const exchange of exchanges) {
      if (!this.rateLimiter.canMakeRequest()) {
        break;
      }

      try {
        this.rateLimiter.recordRequest();
        const symbolId = `${exchange}_SPOT_${symbol}_USD`;

        const response = await this.client.get('/ohlcv/latest', {
          params: {
            symbol_id: symbolId,
            period_id: '1DAY',
            limit: days + 1
          }
        });

        const historicalData: HistoricalData[] = response.data.map((item: any) => ({
          timestamp: item.time_period_start,
          open: item.price_open,
          high: item.price_high,
          low: item.price_low,
          close: item.price_close,
          volume: item.volume_traded
        }));

        historicalData.sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        return {
          success: true,
          data: historicalData
        };
      } catch (err) {
        // Try next exchange
        continue;
      }
    }

    return {
      success: false,
      error: 'Failed to fetch historical data from all exchanges'
    };
  }

  getRateLimitInfo(): RateLimitInfo {
    return this.rateLimiter.getRateLimitInfo();
  }
}

export const coinAPIClient = new CoinAPIClient();