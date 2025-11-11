'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalData } from '@/types';

interface PriceChartProps {
  data: HistoricalData[];
  title?: string;
  height?: number;
}

export function PriceChart({ data, title = 'Price Chart', height = 400 }: PriceChartProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const chartData = data.map(item => ({
    ...item,
    date: formatDate(item.timestamp),
    fullDate: item.timestamp
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#ccc' }}
          />
          <YAxis
            tickFormatter={formatPrice}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#ccc' }}
          />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), 'Price']}
            labelFormatter={(label: string, payload: any) => {
              if (payload && payload[0]) {
                return new Date(payload[0].payload.fullDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              }
              return label;
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}