import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { mapWeatherCodeToCondition } from '../utils/rules';
import { CloudSun, Sun, CloudRain, Wind, Droplets, Compass } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const { weather, activeDestination, activeDayIndex, itinerary } = useTravel();
  const [useFahrenheit, setUseFahrenheit] = useState(false);

  if (!weather) return null;

  const currentCondition = mapWeatherCodeToCondition(weather.current.weatherCode);
  const activeDayForecast = weather.daily[activeDayIndex] || weather.daily[0];

  const toDisplayTemp = (celsius: number) => {
    if (useFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-5 h-5 text-amber-500" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code)) {
      return <CloudRain className="w-5 h-5 text-sky-400" />;
    }
    return <CloudSun className="w-5 h-5 text-amber-600/80" />;
  };

  return (
    <div className="bg-stone-100/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-4 sm:p-5 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Current Conditions */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700/80 shadow-2xs">
            {getWeatherIcon(weather.current.weatherCode)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 font-editorial">
                {activeDestination.city}
              </span>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {toDisplayTemp(weather.current.temp)}
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                (Feels like {toDisplayTemp(weather.current.feelsLike)})
              </span>
              
              {/* Unit Toggle */}
              <button
                onClick={() => setUseFahrenheit(!useFahrenheit)}
                className="ml-2 text-[10px] font-semibold tracking-wider text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 border border-stone-300 dark:border-stone-700 px-1.5 py-0.5 rounded transition-colors"
                title="Toggle temperature scale"
              >
                {useFahrenheit ? 'Switch to °C' : 'Switch to °F'}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 dark:text-stone-400 mt-1">
              <span>{currentCondition.label}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-sky-500" />
                {weather.current.humidity}% Humidity
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-stone-400" />
                {weather.current.windSpeed} km/h Wind
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-600" />
                UV Index {activeDayForecast?.uvIndex ?? 6}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Anticipatory Wardrobe & Weather Tip */}
        <div className="lg:max-w-md xl:max-w-lg text-xs leading-relaxed text-stone-700 dark:text-stone-300 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800 pt-3 lg:pt-0 lg:pl-5">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-medium mb-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Anticipatory Advisory for Day {activeDayIndex + 1}</span>
          </div>
          <p className="italic text-stone-600 dark:text-stone-400 font-serif text-[13px]">
            "{currentCondition.conciergeTip} {itinerary.destination.climateNotes}"
          </p>
        </div>

      </div>

      {/* Multi-Day Forecast Micro Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mt-4 pt-3 border-t border-stone-200/80 dark:border-stone-800/80">
        {weather.daily.slice(0, itinerary.durationDays).map((dayForecast, idx) => {
          const isSelected = idx === activeDayIndex;
          return (
            <div
              key={idx}
              className={`p-2 rounded-lg text-center transition-all ${
                isSelected
                  ? 'bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/80 text-amber-950 dark:text-amber-100'
                  : 'bg-white/60 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/40 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                {dayForecast.day}
              </div>
              <div className="flex justify-center my-1">
                {getWeatherIcon(dayForecast.weatherCode)}
              </div>
              <div className="text-xs font-semibold">
                {toDisplayTemp(dayForecast.tempMax)}{' '}
                <span className="text-[10px] font-normal text-stone-400">
                  {toDisplayTemp(dayForecast.tempMin)}
                </span>
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                {dayForecast.precipProb}% Rain
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
