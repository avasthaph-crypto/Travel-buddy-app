import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { buildGoogleMapsRouteUrl, buildSingleLocationMapUrl, buildGoogleEarthUrl } from '../utils/rules';
import { 
  Navigation, 
  MapPin, 
  ExternalLink, 
  Footprints, 
  Clock, 
  ChevronRight, 
  Layers, 
  Download, 
  Compass, 
  CheckCircle,
  LocateFixed
} from 'lucide-react';

export const InteractiveMapDirections: React.FC = () => {
  const { itinerary, activeDayIndex, setActiveDayIndex } = useTravel();
  const [selectedStopIndex, setSelectedStopIndex] = useState<number>(0);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const activeDay = itinerary.days[activeDayIndex] || itinerary.days[0];
  const items = activeDay.items;
  const selectedItem = items[selectedStopIndex] || items[0];

  const fullGoogleMapsRoute = buildGoogleMapsRouteUrl(items);

  // Center coordinate for the day's route
  const avgLat = items.reduce((acc, curr) => acc + curr.coordinates.lat, 0) / (items.length || 1);
  const avgLng = items.reduce((acc, curr) => acc + curr.coordinates.lng, 0) / (items.length || 1);

  // Google Maps embed URL using the selected stop or center
  const embedQuery = encodeURIComponent(`${selectedItem.locationName}, ${itinerary.destination.city}`);
  const googleMapEmbedUrl = `https://www.google.com/maps?q=${embedQuery}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=15&output=embed`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold mb-1">
            Real-Time Navigation & Route Optimization
          </div>
          <h1 className="text-3xl font-editorial font-bold text-stone-900 dark:text-stone-50">
            {itinerary.destination.city} Wayfinding & Google Maps
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Step-by-step route for Day {activeDay.dayNumber} ({activeDay.theme}) with turn-by-turn walking and cab guidance.
          </p>
        </div>

        {/* Global Action: Open full day route in Google Maps */}
        <div className="flex items-center gap-2">
          <a
            href={fullGoogleMapsRoute}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 rounded-lg shadow-sm hover:opacity-90 transition-all"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
            <span>Launch Complete Route in Google Maps</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 border-b border-stone-200 dark:border-stone-800">
        {itinerary.days.map((day, idx) => (
          <button
            key={day.dayNumber}
            onClick={() => {
              setActiveDayIndex(idx);
              setSelectedStopIndex(0);
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
              idx === activeDayIndex
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 border border-transparent'
            }`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Map Layout: Left Stop List, Right Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Sequential Stops with Navigation Prompts */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 px-1">
            <span>Daily Sequence ({items.length} Stops)</span>
            <span>Tap stop to center map</span>
          </div>

          <div className="space-y-2.5">
            {items.map((item, idx) => {
              const isSelected = idx === selectedStopIndex;
              const singleUrl = buildSingleLocationMapUrl(item.locationName, itinerary.destination.city, item.coordinates);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedStopIndex(idx)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all text-left ${
                    isSelected
                      ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-sm'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    
                    {/* Stop Number Pin */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 text-[11px] text-stone-500 dark:text-stone-400">
                        <span className="font-semibold text-amber-700 dark:text-amber-400">
                          {item.time}
                        </span>
                        <span className="capitalize">{item.category}</span>
                      </div>

                      <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate mt-0.5">
                        {item.title}
                      </div>

                      <div className="text-xs text-stone-500 dark:text-stone-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{item.locationName} · {item.neighborhood}</span>
                      </div>

                      {/* Distance snippet */}
                      {item.distanceFromPrev && idx > 0 && (
                        <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 flex items-center gap-1">
                          <Footprints className="w-3 h-3 text-amber-600" />
                          <span>{item.distanceFromPrev}</span>
                        </div>
                      )}

                      {/* Direct Google Maps link and Google Earth 3D for this stop */}
                      <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <a
                            href={singleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          <a
                            href={buildGoogleEarthUrl(item.coordinates.lat, item.coordinates.lng, 650, 60)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                            title="Fly to this venue in Google Earth 3D"
                          >
                            <span>Earth 3D</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>

                        <span className="text-[10px] text-stone-400">
                          {item.coordinates.lat.toFixed(4)}, {item.coordinates.lng.toFixed(4)}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Google Map View & Detailed Inspector */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Map Controls */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs">
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-medium">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Viewing Stop #{selectedStopIndex + 1}: {selectedItem.title}</span>
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-stone-200 dark:bg-stone-800 rounded-lg">
              <button
                onClick={() => setMapType('roadmap')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all ${
                  mapType === 'roadmap'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Roadmap
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all ${
                  mapType === 'satellite'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>

          {/* Embedded Map Frame with Fallback Visualizer */}
          <div className="relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-lg bg-stone-100 dark:bg-stone-950">
            <iframe
              title={`Google Map - ${selectedItem.locationName}`}
              src={googleMapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />

            {/* Floating Quick Action overlay in map corner */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-stone-950/90 text-stone-100 p-3.5 rounded-xl border border-stone-800 shadow-xl backdrop-blur-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                    Stop #{selectedStopIndex + 1} · {selectedItem.neighborhood}
                  </div>
                  <div className="text-sm font-semibold text-white truncate">
                    {selectedItem.locationName}
                  </div>
                  <div className="text-xs text-stone-300 mt-0.5 line-clamp-1">
                    {selectedItem.insiderTip}
                  </div>
                </div>

                <a
                  href={buildSingleLocationMapUrl(selectedItem.locationName, itinerary.destination.city, selectedItem.coordinates)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg shrink-0 transition-colors flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>
          </div>

          {/* Offline Navigation Guarantee Card */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Offline Navigation Guarantee:</strong> All waypoint addresses, landmark references, and coordinates are pre-cached in your device vault. Even when roaming offline without cellular reception, you can tap any stop to initiate cached GPS wayfinding.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
