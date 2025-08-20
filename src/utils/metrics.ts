import { WeatherData, SelectedTimeRange, TemperatureMetrics } from '../types/weather';

export function calculateMetrics(
  weatherData: WeatherData,
  selectedTimeRange: SelectedTimeRange
): TemperatureMetrics {
  if (!weatherData || !weatherData.hourly) {
    return { current: 0, average: 0, min: 0, max: 0, totalHours: 0 };
  }

  const { time, temperature_2m } = weatherData.hourly;
  
  let relevantTemps: number[] = [];
  let currentTemp = 0;

  if (selectedTimeRange.mode === 'single' && selectedTimeRange.single) {
    const selectedTime = selectedTimeRange.single.getTime();
    let closestIndex = 0;
    let closestDiff = Infinity;

    time.forEach((t, index) => {
      const timeMs = new Date(t).getTime();
      const diff = Math.abs(timeMs - selectedTime);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = index;
      }
    });

    currentTemp = temperature_2m[closestIndex] || 0;
    relevantTemps = [currentTemp];
  } else if (selectedTimeRange.mode === 'range' && selectedTimeRange.range) {
    const startTime = selectedTimeRange.range.start.getTime();
    const endTime = selectedTimeRange.range.end.getTime();

    time.forEach((t, index) => {
      const timeMs = new Date(t).getTime();
      if (timeMs >= startTime && timeMs <= endTime) {
        relevantTemps.push(temperature_2m[index]);
      }
    });

    currentTemp = relevantTemps[relevantTemps.length - 1] || 0;
  }

  const average = relevantTemps.length > 0 
    ? relevantTemps.reduce((sum, temp) => sum + temp, 0) / relevantTemps.length 
    : 0;
  const min = relevantTemps.length > 0 ? Math.min(...relevantTemps) : 0;
  const max = relevantTemps.length > 0 ? Math.max(...relevantTemps) : 0;

  return {
    current: Math.round(currentTemp * 10) / 10,
    average: Math.round(average * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    totalHours: relevantTemps.length
  };
}