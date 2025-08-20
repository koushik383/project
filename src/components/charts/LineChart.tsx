import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { format } from 'date-fns';

export const TemperatureLineChart: React.FC = () => {
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
    
    if (selectedTimeRange.mode === 'single' && selectedTimeRange.single) {
      // Show 24 hours around the selected time
      const selectedTime = selectedTimeRange.single.getTime();
      const data = time.map((t, index) => ({
        time: t,
        temperature: temperature_2m[index],
        timestamp: new Date(t).getTime()
      })).filter(item => {
        const diff = Math.abs(item.timestamp - selectedTime);
        return diff <= 12 * 60 * 60 * 1000; // 12 hours before and after
      });
      
      return data.map(item => ({
        time: format(new Date(item.time), 'HH:mm'),
        temperature: item.temperature,
        isSelected: Math.abs(item.timestamp - selectedTime) < 30 * 60 * 1000 // 30 minutes tolerance
      }));
    }

    if (selectedTimeRange.mode === 'range' && selectedTimeRange.range) {
      const startTime = selectedTimeRange.range.start.getTime();
      const endTime = selectedTimeRange.range.end.getTime();
      
      return time.map((t, index) => ({
        time: format(new Date(t), 'MM/dd HH:mm'),
        temperature: temperature_2m[index],
        timestamp: new Date(t).getTime()
      })).filter(item => item.timestamp >= startTime && item.timestamp <= endTime);
    }

    return [];
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{label}</p>
          <p className="text-purple-400 font-semibold">
            {`Temperature: ${payload[0].value}°C`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Temperature Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
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
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#A855F7' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};