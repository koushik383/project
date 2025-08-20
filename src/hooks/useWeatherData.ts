import { useEffect, useRef } from 'react';
import { format, subDays } from 'date-fns';
import { useDashboard } from '../context/DashboardContext';
import { WeatherApiService } from '../services/weatherApi';
import { calculateMetrics } from '../utils/metrics';

export const useWeatherData = () => {
  const { state, dispatch } = useDashboard();
  const { selectedTimeRange } = state;
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const endDate = new Date();
        const startDate = subDays(endDate, 14); // Get 2 weeks of data

        const startDateStr = format(startDate, 'yyyy-MM-dd');
        const endDateStr = format(endDate, 'yyyy-MM-dd');

        // Use mock data for demo (uncomment the line below to use real API)
        // const weatherData = await WeatherApiService.fetchWeatherData(52.52, 13.41, startDateStr, endDateStr);
        const weatherData = WeatherApiService.generateMockData(startDateStr, endDateStr);

        dispatch({ type: 'SET_WEATHER_DATA', payload: weatherData });

        // Initialize with current time if no selection
        if (!selectedTimeRange.single && !selectedTimeRange.range) {
          dispatch({
            type: 'SET_TIME_RANGE',
            payload: { mode: 'single', single: new Date() }
          });
        }
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to fetch weather data' 
        });
        console.error('Weather data fetch error:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    // Debounce API calls
    clearTimeout(fetchTimeoutRef.current);
    fetchTimeoutRef.current = setTimeout(fetchData, 300);

    return () => clearTimeout(fetchTimeoutRef.current);
  }, []); // Only run once on mount

  // Calculate metrics when weather data or time range changes
  useEffect(() => {
    if (state.weatherData && (selectedTimeRange.single || selectedTimeRange.range)) {
      const metrics = calculateMetrics(state.weatherData, selectedTimeRange);
      dispatch({ type: 'SET_METRICS', payload: metrics });
    }
  }, [state.weatherData, selectedTimeRange, dispatch]);

  return {
    loading: state.loading,
    error: state.error,
    weatherData: state.weatherData,
    metrics: state.metrics
  };
};