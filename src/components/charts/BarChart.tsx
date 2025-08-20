import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { format, startOfDay, isSameDay } from 'date-fns';

export const TemperatureBarChart: React.FC = () => {
  const { state } = useDashboard();
  const { weatherData, selectedTimeRange } = state;

  if (!weatherData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="animate-pulse h-64 bg-gray-700 rounded"></div>
      </div>
    );
  }

  const getChartData = () => {
    const { time, temperature_2m } = weatherData.hourly;
    
    // Group data by day and calculate min/max
    const dailyData = new Map<string, { min: number; max: number; temperatures: number[] }>();
    
    time.forEach((t, index) => {
      const date = new Date(t);
      const dayKey = format(startOfDay(date), 'yyyy-MM-dd');
      
      if (!dailyData.has(dayKey)) {
        dailyData.set(dayKey, { min: temperature_2m[index], max: temperature_2m[index], temperatures: [] });
      }
      
      const dayData = dailyData.get(dayKey)!;
      dayData.temperatures.push(temperature_2m[index]);
      dayData.min = Math.min(dayData.min, temperature_2m[index]);
      dayData.max = Math.max(dayData.max, temperature_2m[index]);
    });

    return Array.from(dailyData.entries()).map(([dayKey, data]) => ({
      day: format(new Date(dayKey), 'MM/dd'),
      min: Math.round(data.min * 10) / 10,
      max: Math.round(data.max * 10) / 10,
      range: Math.round((data.max - data.min) * 10) / 10
    })).slice(0, 7); // Show last 7 days
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{`Date: ${label}`}</p>
          <p className="text-red-400 text-sm">{`Min: ${payload[0]?.value}°C`}</p>
          <p className="text-orange-400 text-sm">{`Max: ${payload[1]?.value}°C`}</p>
          <p className="text-blue-400 text-sm">{`Range: ${payload[1]?.value - payload[0]?.value}°C`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Daily Min/Max Temperature</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="day" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: '°C', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="min" fill="#EF4444" name="Min Temperature" />
            <Bar dataKey="max" fill="#F97316" name="Max Temperature" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};