'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalData } from '@/types';

interface VolumeChartProps {
  data: HistoricalData[];
  title?: string;
  height?: number;
}

export function VolumeChart({ data, title = 'Volume Chart', height = 200 }: VolumeChartProps) {
  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
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
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#ccc' }}
          />
          <YAxis
            tickFormatter={formatVolume}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#ccc' }}
          />
          <Tooltip
            formatter={(value: number) => [formatVolume(value), 'Volume']}
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
          <Bar
            dataKey="volume"
            fill="#8b5cf6"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}