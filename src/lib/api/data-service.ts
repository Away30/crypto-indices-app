import { CryptoIndex, HistoricalData, ApiResponse, TechnicalIndicator } from '@/types';

export class DataService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000';
  }

  async getCryptoIndices(): Promise<ApiResponse<CryptoIndex[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/indices`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch crypto indices'
      };
    }
  }

  async getHistoricalData(symbol: string, days: number = 30): Promise<ApiResponse<HistoricalData[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/historical?symbol=${symbol}&days=${days}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch historical data'
      };
    }
  }

  async getApiStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/api/status`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch API status'
      };
    }
  }

  // Mock technical indicators - in a real app, this would call actual API
  generateMockIndicators(historicalData: HistoricalData[]): TechnicalIndicator[] {
    if (!historicalData.length) return [];

    const latest = historicalData[historicalData.length - 1];
    const sma20 = this.calculateSMA(historicalData, 20);
    const rsi = this.calculateRSI(historicalData, 14);

    return [
      {
        indicator: 'SMA 20',
        value: sma20,
        timestamp: latest.timestamp,
        signal: latest.close > sma20 ? 'BUY' : 'SELL'
      },
      {
        indicator: 'RSI 14',
        value: rsi,
        timestamp: latest.timestamp,
        signal: rsi > 70 ? 'SELL' : rsi < 30 ? 'BUY' : 'NEUTRAL'
      },
      {
        indicator: 'Volume',
        value: latest.volume,
        timestamp: latest.timestamp,
        signal: 'NEUTRAL'
      }
    ];
  }

  private calculateSMA(data: HistoricalData[], period: number): number {
    if (data.length < period) return 0;
    const slice = data.slice(-period);
    const sum = slice.reduce((acc, item) => acc + item.close, 0);
    return sum / period;
  }

  private calculateRSI(data: HistoricalData[], period: number): number {
    if (data.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = data.length - period; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }
}

export const dataService = new DataService();