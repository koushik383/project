import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { WeatherData, SelectedTimeRange, TemperatureMetrics } from '../types/weather';

interface DashboardState {
  weatherData: WeatherData | null;
  selectedTimeRange: SelectedTimeRange;
  isPlaying: boolean;
  playSpeed: number;
  metrics: TemperatureMetrics | null;
  loading: boolean;
  error: string | null;
}

type DashboardAction =
  | { type: 'SET_WEATHER_DATA'; payload: WeatherData }
  | { type: 'SET_TIME_RANGE'; payload: SelectedTimeRange }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_PLAY_SPEED'; payload: number }
  | { type: 'SET_METRICS'; payload: TemperatureMetrics }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: DashboardState = {
  weatherData: null,
  selectedTimeRange: {
    mode: 'single',
    single: new Date(),
  },
  isPlaying: false,
  playSpeed: 1000,
  metrics: null,
  loading: false,
  error: null,
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_WEATHER_DATA':
      return { ...state, weatherData: action.payload };
    case 'SET_TIME_RANGE':
      return { ...state, selectedTimeRange: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_PLAY_SPEED':
      return { ...state, playSpeed: action.payload };
    case 'SET_METRICS':
      return { ...state, metrics: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
} | null>(null);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};