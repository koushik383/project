import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';

export const TemperaturePieChart: React.FC = () => {
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
    
    let relevantTemps: number[] = [];

    if (selectedTimeRange.mode === 'single' && selectedTimeRange.single) {
      // Use the last 24 hours for classification
      const selectedTime = selectedTimeRange.single.getTime();
      relevantTemps = time.map((t, index) => ({
        temp: temperature_2m[index],
        time: new Date(t).getTime()
      })).filter(item => {
        const diff = Math.abs(item.time - selectedTime);
        return diff <= 12 * 60 * 60 * 1000; // 12 hours around
      }).map(item => item.temp);
    } else if (selectedTimeRange.mode === 'range' && selectedTimeRange.range) {
      const startTime = selectedTimeRange.range.start.getTime();
      const endTime = selectedTimeRange.range.end.getTime();
      
      relevantTemps = time.map((t, index) => ({
        temp: temperature_2m[index],
        time: new Date(t).getTime()
      })).filter(item => item.time >= startTime && item.time <= endTime)
        .map(item => item.temp);
    }

    // Classify temperatures
    const cold = relevantTemps.filter(temp => temp < 10).length;
    const cool = relevantTemps.filter(temp => temp >= 10 && temp < 20).length;
    const warm = relevantTemps.filter(temp => temp >= 20 && temp < 30).length;
    const hot = relevantTemps.filter(temp => temp >= 30).length;

    return [
      { name: 'Cold (<10°C)', value: cold, color: '#3B82F6' },
      { name: 'Cool (10-20°C)', value: cool, color: '#10B981' },
      { name: 'Warm (20-30°C)', value: warm, color: '#F59E0B' },
      { name: 'Hot (>30°C)', value: hot, color: '#EF4444' }
    ].filter(item => item.value > 0);
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{data.name}</p>
          <p className="text-purple-400 font-semibold">{`${data.value} hours`}</p>
          <p className="text-gray-400 text-xs">{`${((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Temperature Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};