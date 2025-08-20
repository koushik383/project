import React from 'react';
import { TemperatureLineChart } from './charts/LineChart';
import { TemperatureBarChart } from './charts/BarChart';
import { TemperaturePieChart } from './charts/PieChart';
import { TemperatureAreaChart } from './charts/AreaChart';

export const ChartsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TemperatureLineChart />
      <TemperatureBarChart />
      <TemperaturePieChart />
      <TemperatureAreaChart />
    </div>
  );
};