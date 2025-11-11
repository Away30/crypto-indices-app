'use client';

import { useWebSocket } from '@/utils/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RealTimePriceProps {
  symbol: string;
  enabled?: boolean;
}

export function RealTimePrice({ symbol, enabled = false }: RealTimePriceProps) {
  const { connected, error, priceUpdates } = useWebSocket(enabled);
  const [isEnabled, setIsEnabled] = useState(enabled);

  const currentPrice = priceUpdates[symbol];
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<'up' | 'down' | 'neutral'>('neutral');

  useEffect(() => {
    if (currentPrice !== undefined && previousPrice !== null) {
      if (currentPrice > previousPrice) {
        setPriceChange('up');
      } else if (currentPrice < previousPrice) {
        setPriceChange('down');
      } else {
        setPriceChange('neutral');
      }
    }
    if (currentPrice !== undefined) {
      setPreviousPrice(currentPrice);
    }
  }, [currentPrice, previousPrice]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getPriceColor = () => {
    switch (priceChange) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };

  if (!isEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="mr-2" size={20} />
              Real-Time Price
            </span>
            <button
              onClick={() => setIsEnabled(true)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enable
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Real-time updates are disabled. Click "Enable" to start receiving live price updates.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Activity className="mr-2" size={20} />
            Real-Time Price
          </span>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center text-sm ${connected ? 'text-green-600' : 'text-red-600'}`}>
              {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
              <span className="ml-1">{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <button
              onClick={() => setIsEnabled(false)}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Disable
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {connected && currentPrice !== undefined ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{symbol}</span>
              <span className={`text-2xl font-bold transition-colors duration-300 ${getPriceColor()}`}>
                {formatPrice(currentPrice)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        ) : connected ? (
          <div className="text-center py-4">
            <p className="text-gray-600">Waiting for price updates...</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">Connecting to real-time feed...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}