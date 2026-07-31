"use client";

import { format } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { DailyPosition } from '@/domain/types';

interface PositionTimelineProps {
  dailyProjection: DailyPosition[];
}

export function PositionTimeline({ dailyProjection }: PositionTimelineProps) {
  const chartData = dailyProjection.map((day) => ({
    date: format(new Date(day.date), 'MMM d'),
    balance: day.projectedBalance / 100,
  }));

  const minBalance = Math.min(...chartData.map((d) => d.balance));
  const maxBalance = Math.max(...chartData.map((d) => d.balance));
  const hasNegative = minBalance < 0;

  // Determine fill color based on whether balance dips below a threshold
  const fillColor = hasNegative ? '#f59e0b' : '#bbf7d0'; // amber-500 or green-200
  const strokeColor = hasNegative ? '#d97706' : '#16a34a'; // amber-600 or green-600

  // Y-axis domain: include some padding
  const yMin = Math.min(0, minBalance) - 100;
  const yMax = maxBalance + 200;

  // Summary for accessibility
  const startBalance = chartData[0]?.balance ?? 0;
  const endBalance = chartData[chartData.length - 1]?.balance ?? 0;
  const trend = endBalance >= startBalance ? 'stable or increasing' : 'decreasing';
  const ariaLabel = `Balance projection chart showing ${chartData.length} days. Starting at $${startBalance.toFixed(0)}, ending at $${endBalance.toFixed(0)}. Trend is ${trend}.${hasNegative ? ' Balance goes below zero during this period.' : ''}`;

  return (
    <div
      className="w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px]">
        <AreaChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `$${value.toLocaleString()}`}
            domain={[yMin, yMax]}
            width={65}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
            labelStyle={{ fontWeight: 600 }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
            }}
          />
          {hasNegative && (
            <ReferenceLine
              y={0}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
          )}
          <Area
            type="monotone"
            dataKey="balance"
            stroke={strokeColor}
            strokeWidth={2}
            fill={fillColor}
            fillOpacity={0.4}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
