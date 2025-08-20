import React from 'react';
import { BarChart3 } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-600 rounded-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-sm text-gray-400">Spatial weather analytics with real-time data</p>
        </div>
      </div>
    </div>
  );
};