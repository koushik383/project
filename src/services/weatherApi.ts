import { WeatherData } from '../types/weather';

const BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export class WeatherApiService {
  static async fetchWeatherData(
    latitude: number = 52.52,
    longitude: number = 13.41,
    startDate: string,
    endDate: string
  ): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      start_date: startDate,
      end_date: endDate,
      hourly: 'temperature_2m',
      timezone: 'auto'
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    return response.json();
  }

  static generateMockData(startDate: string, endDate: string): WeatherData {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    const times: string[] = [];
    const temperatures: number[] = [];
    
    for (let i = 0; i < hours; i++) {
      const currentTime = new Date(start.getTime() + i * 60 * 60 * 1000);
      times.push(currentTime.toISOString());
      
      // Generate realistic temperature data with daily and seasonal patterns
      const hourOfDay = currentTime.getHours();
      const dayTemp = 15 + Math.sin((hourOfDay - 6) * Math.PI / 12) * 8;
      const noise = (Math.random() - 0.5) * 4;
      temperatures.push(Math.round((dayTemp + noise) * 10) / 10);
    }

    return {
      latitude: 52.52,
      longitude: 13.41,
      generationtime_ms: 0.123,
      utc_offset_seconds: 7200,
      timezone: 'Europe/Berlin',
      timezone_abbreviation: 'CEST',
      elevation: 74,
      hourly_units: {
        time: 'iso8601',
        temperature_2m: '°C'
      },
      hourly: {
        time: times,
        temperature_2m: temperatures
      }
    };
  }
}