import React, { useState, useEffect } from 'react';
import { Play, Pause, Calendar, Clock } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { format, addHours, subDays } from 'date-fns';

export const TimeSlider: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const { selectedTimeRange, isPlaying, playSpeed } = state;
  
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sliderMode, setSliderMode] = useState<'single' | 'range'>('single');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && selectedTimeRange.mode === 'single' && selectedTimeRange.single) {
      interval = setInterval(() => {
        const nextHour = addHours(selectedTimeRange.single!, 1);
        const endDateTime = new Date(`${endDate}T23:59:59`);
        
        if (nextHour <= endDateTime) {
          dispatch({
            type: 'SET_TIME_RANGE',
            payload: { mode: 'single', single: nextHour }
          });
        } else {
          dispatch({ type: 'SET_PLAYING', payload: false });
        }
      }, playSpeed);
    }

    return () => clearInterval(interval);
  }, [isPlaying, selectedTimeRange, playSpeed, endDate, dispatch]);

  const togglePlay = () => {
    dispatch({ type: 'SET_PLAYING', payload: !isPlaying });
  };

  const handleSliderChange = (value: number) => {
    const startDateTime = new Date(`${startDate}T00:00:00`);
    const selectedDateTime = addHours(startDateTime, value);
    
    dispatch({
      type: 'SET_TIME_RANGE',
      payload: { mode: 'single', single: selectedDateTime }
    });
  };

  const getMaxHours = () => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  };

  const getCurrentHour = () => {
    if (selectedTimeRange.mode === 'single' && selectedTimeRange.single) {
      const start = new Date(`${startDate}T00:00:00`);
      return Math.floor((selectedTimeRange.single.getTime() - start.getTime()) / (1000 * 60 * 60));
    }
    return 0;
  };

  const getSelectedTimeDisplay = () => {
    if (selectedTimeRange.mode === 'single' && selectedTimeRange.single) {
      return format(selectedTimeRange.single, 'MMM dd, yyyy HH:mm');
    }
    if (selectedTimeRange.mode === 'range' && selectedTimeRange.range) {
      return `${format(selectedTimeRange.range.start, 'MMM dd HH:mm')} - ${format(selectedTimeRange.range.end, 'MMM dd HH:mm')}`;
    }
    return 'No selection';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Clock className="w-5 h-5 mr-2 text-purple-400" />
          Time Control
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-700 text-white rounded px-3 py-1 text-sm border border-gray-600 focus:border-purple-400 focus:outline-none"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-700 text-white rounded px-3 py-1 text-sm border border-gray-600 focus:border-purple-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Selected Time:</span>
          <span className="text-sm font-medium text-purple-300">{getSelectedTimeDisplay()}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="range"
            min="0"
            max={getMaxHours()}
            value={getCurrentHour()}
            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{startDate}</span>
            <span>{endDate}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlay}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play</span>
              </>
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Speed:</span>
            <select
              value={playSpeed}
              onChange={(e) => dispatch({ type: 'SET_PLAY_SPEED', payload: parseInt(e.target.value) })}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-purple-400 focus:outline-none"
            >
              <option value={2000}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
              <option value={250}>4x</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">Mode:</span>
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSliderMode('single')}
              className={`px-3 py-1 text-xs rounded ${sliderMode === 'single' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Single
            </button>
            <button
              onClick={() => setSliderMode('range')}
              className={`px-3 py-1 text-xs rounded ${sliderMode === 'range' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Range
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};