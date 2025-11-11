'use client';

import { useParams, useRouter } from 'next/navigation';
import { useHistoricalData } from '@/utils/hooks';
import { PriceChart } from '@/components/charts/PriceChart';
import { VolumeChart } from '@/components/charts/VolumeChart';
import { TechnicalIndicators } from '@/components/TechnicalIndicators';
import { RealTimePrice } from '@/components/RealTimePrice';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Database } from 'lucide-react';
import { useState } from 'react';

export default function DetailView() {
  const params = useParams();
  const router = useRouter();
  const symbol = params?.symbol as string || 'BTC';

  const { data, indicators, loading, error, cached, refetch } = useHistoricalData(symbol, 30);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleBack = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading {symbol} data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const latestData = data[data.length - 1];
  const oldestData = data[0];
  const totalChange = latestData && oldestData
    ? latestData.close - oldestData.close
    : 0;
  const totalChangePercent = latestData && oldestData
    ? ((latestData.close - oldestData.close) / oldestData.close) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {symbol} - 30 Day Analysis
                </h1>
                <p className="text-gray-600">Detailed cryptocurrency analysis and indicators</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {cached && (
                <div className="flex items-center text-sm text-blue-600">
                  <Database size={16} className="mr-1" />
                  Cached Data
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        {latestData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>30-Day Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="text-2xl font-bold">
                    ${latestData.close.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">30-Day Change</p>
                  <p className={`text-2xl font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalChange >= 0 ? '+' : ''}${totalChange.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">30-Day Change %</p>
                  <p className={`text-2xl font-bold ${totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">24h Volume</p>
                  <p className="text-2xl font-bold">
                    ${latestData.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts and Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <PriceChart
                  data={data}
                  title={`${symbol} Price (30 Days)`}
                  height={400}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <VolumeChart
                  data={data}
                  title={`${symbol} Volume (30 Days)`}
                  height={250}
                />
              </CardContent>
            </Card>
          </div>

          {/* Technical Indicators */}
          <div className="space-y-8">
            <RealTimePrice symbol={symbol} enabled={true} />
            <TechnicalIndicators indicators={indicators} />
          </div>
        </div>

        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No historical data available for {symbol}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload Data
            </button>
          </div>
        )}
      </main>
    </div>
  );
}