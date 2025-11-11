import { useState, useEffect, useCallback } from 'react';
import { CryptoIndex, HistoricalData, TechnicalIndicator } from '@/types';
import { dataService } from '@/lib/api/data-service';

export function useCryptoIndices() {
  const [data, setData] = useState<CryptoIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await dataService.getCryptoIndices();

    if (result.success && result.data) {
      setData(result.data);
      setCached(result.cached || false);
    } else {
      setError(result.error || 'Unknown error');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, cached, refetch: fetchData };
}

export function useHistoricalData(symbol: string, days: number = 30) {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  const fetchData = useCallback(async () => {
    if (!symbol) return;

    setLoading(true);
    setError(null);

    const result = await dataService.getHistoricalData(symbol, days);

    if (result.success && result.data) {
      setData(result.data);
      setCached(result.cached || false);

      // Generate technical indicators
      const mockIndicators = dataService.generateMockIndicators(result.data);
      setIndicators(mockIndicators);
    } else {
      setError(result.error || 'Unknown error');
    }

    setLoading(false);
  }, [symbol, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, indicators, loading, error, cached, refetch: fetchData };
}

export function useApiStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    const result = await dataService.getApiStatus();
    if (result.success) {
      setStatus(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return { status, loading, refetch: fetchStatus };
}