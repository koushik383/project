import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { format } from 'date-fns';

export const TemperatureAreaChart: React.FC = () => {
  const { state } = useDashboard();
  const { weatherData } = state;

  if (!weatherData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="animate-pulse h-64 bg-gray-700 rounded"></div>
      </div>
    );
  }

  const getChartData = () => {
    const { time, temperature_2m } = weatherData.hourly;
    
    // Create hourly average distribution (24 hours)
    const hourlyAvg = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      temperatures: [] as number[]
    }));

    time.forEach((t, index) => {
      const date = new Date(t);
      const hour = date.getHours();
      hourlyAvg[hour].temperatures.push(temperature_2m[index]);
    });

    return hourlyAvg.map(({ hour, temperatures }) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      average: temperatures.length > 0 
        ? Math.round((temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length) * 10) / 10
        : 0,
      count: temperatures.length
    }));
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{`Hour: ${label}`}</p>
          <p className="text-purple-400 font-semibold">
            {`Avg Temperature: ${payload[0].value}°C`}
          </p>
          <p className="text-gray-400 text-xs">
            {`${payload[0].payload.count} data points`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Hourly Temperature Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="hour" 
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
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="average" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#temperatureGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};