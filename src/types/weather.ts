export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface SelectedTimeRange {
  mode: 'single' | 'range';
  single?: Date;
  range?: TimeRange;
}

export interface TemperatureMetrics {
  current: number;
  average: number;
  min: number;
  max: number;
  totalHours: number;
}