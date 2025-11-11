import { TechnicalIndicator } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicator[];
}

export function TechnicalIndicators({ indicators }: TechnicalIndicatorsProps) {
  const getSignalIcon = (signal?: string) => {
    switch (signal) {
      case 'BUY':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'SELL':
        return <TrendingDown size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-gray-600" />;
    }
  };

  const getSignalColor = (signal?: string) => {
    switch (signal) {
      case 'BUY':
        return 'text-green-600 bg-green-50';
      case 'SELL':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatValue = (indicator: TechnicalIndicator) => {
    if (indicator.indicator.includes('RSI')) {
      return indicator.value.toFixed(2);
    }
    if (indicator.indicator.includes('Volume')) {
      if (indicator.value >= 1e9) return `${(indicator.value / 1e9).toFixed(2)}B`;
      if (indicator.value >= 1e6) return `${(indicator.value / 1e6).toFixed(2)}M`;
      return indicator.value.toLocaleString();
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(indicator.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">{indicator.indicator}</div>
                <div className="text-2xl font-bold">{formatValue(indicator)}</div>
                <div className="text-sm text-gray-500">
                  {new Date(indicator.timestamp).toLocaleString()}
                </div>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${getSignalColor(indicator.signal)}`}>
                {getSignalIcon(indicator.signal)}
                <span className="font-medium text-sm">{indicator.signal}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}