import React from 'react';
import { DashboardProvider } from './context/DashboardContext';
import { TopBar } from './components/TopBar';
import { TimeSlider } from './components/TimeSlider';
import { MetricCards } from './components/MetricCards';
import { ChartsGrid } from './components/ChartsGrid';
import { useWeatherData } from './hooks/useWeatherData';

const DashboardContent: React.FC = () => {
  const { loading, error } = useWeatherData();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Error loading data</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <TopBar />
      
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <TimeSlider />
        <MetricCards />
        <ChartsGrid />
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-400 border-t-transparent"></div>
            <span className="text-white">Loading weather data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export default App;