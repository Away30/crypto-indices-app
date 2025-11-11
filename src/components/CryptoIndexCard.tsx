import { CryptoIndex } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoIndexCardProps {
  index: CryptoIndex;
  onClick?: () => void;
}

export function CryptoIndexCard({ index, onClick }: CryptoIndexCardProps) {
  const isPositive = index.changePercent24h >= 0;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow cursor-pointer ${onClick ? 'hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{index.name}</CardTitle>
            <p className="text-gray-600 text-sm">{index.symbol}</p>
          </div>
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            <span className="font-semibold">
              {isPositive ? '+' : ''}{index.changePercent24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(index.price)}
            </div>
            <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{formatPrice(index.change24h)} (24h)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Market Cap</p>
              <p className="font-semibold">{formatLargeNumber(index.marketCap)}</p>
            </div>
            <div>
              <p className="text-gray-600">Volume (24h)</p>
              <p className="font-semibold">{formatLargeNumber(index.volume24h)}</p>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Last updated: {new Date(index.lastUpdated).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}