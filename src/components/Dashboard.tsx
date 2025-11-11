'use client';

import { useState } from 'react';
import { useCryptoIndices, useApiStatus } from '@/utils/hooks';
import { CryptoIndexCard } from '@/components/CryptoIndexCard';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Activity, Database, Clock } from 'lucide-react';

export default function Dashboard() {
  const { data: indices, loading, error, cached, refetch } = useCryptoIndices();
  const { status } = useApiStatus();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleIndexClick = (symbol: string) => {
    // Navigate to detail view - implement routing
    window.location.href = `/detail/${symbol}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading crypto indices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crypto Indices Dashboard</h1>
              <p className="text-gray-600">Real-time cryptocurrency indices and indicators</p>
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
        {/* Status Bar */}
        {status && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2" size={20} />
                API Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="mr-2" size={16} />
                  <span>Requests Remaining: {status.rateLimit?.requestsRemaining || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <Database className="mr-2" size={16} />
                  <span>Cache Hits: {status.cache?.hits || 0}</span>
                </div>
                <div className="flex items-center">
                  <Activity className="mr-2" size={16} />
                  <span>Cache Keys: {status.cache?.keys || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Indices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indices.map((index) => (
            <CryptoIndexCard
              key={index.id}
              index={index}
              onClick={() => handleIndexClick(index.symbol)}
            />
          ))}
        </div>

        {indices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No crypto indices available</p>
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