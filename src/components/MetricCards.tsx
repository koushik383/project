import React from 'react';
import { Thermometer, TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, subtitle, icon, trend }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          {icon}
        </div>
        {getTrendIcon()}
      </div>
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-lg text-purple-400">{unit}</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
};

export const MetricCards: React.FC = () => {
  const { state } = useDashboard();
  const { metrics, selectedTimeRange } = state;

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  const getTemperatureTrend = (temp: number) => {
    if (temp > 20) return 'up';
    if (temp < 10) return 'down';
    return 'neutral';
  };

  const getModeText = () => {
    if (selectedTimeRange.mode === 'single') {
      return 'Single point selected';
    }
    return `Range of ${metrics.totalHours} hours`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <MetricCard
        title="Current Temperature"
        value={metrics.current}
        unit="°C"
        subtitle="Latest selected hour"
        icon={<Thermometer className="w-5 h-5 text-purple-400" />}
        trend={getTemperatureTrend(metrics.current)}
      />
      
      <MetricCard
        title="Average Temperature"
        value={selectedTimeRange.mode === 'single' ? '--' : metrics.average}
        unit={selectedTimeRange.mode === 'single' ? '' : '°C'}
        subtitle={selectedTimeRange.mode === 'single' ? 'Select range to view' : 'Mean in selected range'}
        icon={<Activity className="w-5 h-5 text-purple-400" />}
        trend={selectedTimeRange.mode === 'single' ? 'neutral' : getTemperatureTrend(metrics.average)}
      />
      
      <MetricCard
        title="Min Temperature"
        value={selectedTimeRange.mode === 'single' ? '--' : metrics.min}
        unit={selectedTimeRange.mode === 'single' ? '' : '°C'}
        subtitle={selectedTimeRange.mode === 'single' ? 'Select range to view' : 'Coldest in range'}
        icon={<TrendingDown className="w-5 h-5 text-purple-400" />}
        trend="down"
      />
      
      <MetricCard
        title="Max Temperature"
        value={selectedTimeRange.mode === 'single' ? '--' : metrics.max}
        unit={selectedTimeRange.mode === 'single' ? '' : '°C'}
        subtitle={selectedTimeRange.mode === 'single' ? 'Select range to view' : 'Warmest in range'}
        icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
        trend="up"
      />
      
      <MetricCard
        title="Total Hours"
        value={metrics.totalHours}
        unit="hrs"
        subtitle={getModeText()}
        icon={<Clock className="w-5 h-5 text-purple-400" />}
        trend="neutral"
      />
    </div>
  );
};