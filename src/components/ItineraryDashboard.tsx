import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { WeatherWidget } from './WeatherWidget';
import { ActivityItem } from '../types/travel';
import { buildGoogleMapsRouteUrl, buildSingleLocationMapUrl, buildGoogleEarthUrl, calculateDayStats, checkDiningMix } from '../utils/rules';
import { 
  Navigation2, 
  ExternalLink, 
  Clock, 
  MapPin, 
  Sparkles, 
  Utensils, 
  CalendarCheck, 
  Share2, 
  CheckCircle2, 
  ChevronRight, 
  Info,
  Footprints,
  Globe
} from 'lucide-react';

export const ItineraryDashboard: React.FC = () => {
  const { 
    itinerary, 
    activeDayIndex, 
    setActiveDayIndex, 
    reservations, 
    updateReservation,
    setShowSyncModal,
    setActiveTab,
  } = useTravel();

  const [expandedEtiquette, setExpandedEtiquette] = useState(false);

  const activeDay = itinerary.days[activeDayIndex] || itinerary.days[0];
  const dayStats = calculateDayStats(activeDay);
  const diningMix = checkDiningMix(activeDay.items);

  const getDiningLabel = (type?: string) => {
    switch (type) {
      case 'street_food':
        return 'Street Food Gem';
      case 'local_market':
        return 'Local Artisan Market';
      case 'hidden_gem':
        return 'Hidden Local Gem';
      case 'upscale_restaurant':
        return 'Upscale Dining / Haute Counter';
      case 'artisan_cafe':
        return 'Artisan Cafe / Tea Salon';
      default:
        return 'Culinary Experience';
    }
  };

  const fullDayRouteUrl = buildGoogleMapsRouteUrl(activeDay.items);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Editorial Trip Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-stone-900 text-stone-100 shadow-xl border border-stone-800 mb-8">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
          <img
            src={itinerary.destination.heroImage}
            alt={itinerary.destination.city}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl">
          
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-300 font-medium mb-3">
            <span>{itinerary.destination.country}</span>
            <span aria-hidden="true">·</span>
            <span>{itinerary.durationDays}-Day Bespoke Journey</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{itinerary.profile.companion} Party</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{itinerary.profile.pace} Rhythm</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-bold tracking-tight text-white leading-tight">
            {itinerary.tripTitle}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-stone-300 leading-relaxed font-light max-w-3xl">
            {itinerary.summary}
          </p>

          {/* Concierge Warm Anticipatory Preamble */}
          <div className="mt-6 pt-6 border-t border-stone-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm text-stone-300 italic font-serif leading-relaxed">
              "{itinerary.conciergePreamble}"
              <span className="block mt-1 text-[11px] font-sans font-normal uppercase tracking-wider text-amber-400 not-italic">
                — Aetheria Private Concierge Team
              </span>
            </div>
          </div>

          {/* Cultural Etiquette Drawer */}
          <div className="mt-6">
            <button
              onClick={() => setExpandedEtiquette(!expandedEtiquette)}
              className="flex items-center gap-2 text-xs font-medium text-amber-300 hover:text-amber-200 focus-visible:outline-none"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{expandedEtiquette ? 'Hide Cultural Customs' : `View ${itinerary.destination.city} Etiquette & Customs (${itinerary.culturalEtiquette.length})`}</span>
            </button>

            {expandedEtiquette && (
              <div className="mt-3 p-4 rounded-xl bg-stone-950/70 border border-stone-800 text-xs text-stone-300 space-y-2 animate-fadeIn">
                {itinerary.culturalEtiquette.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-serif">◇</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Real-Time Weather Widget */}
      <WeatherWidget />

      {/* Day Selector & Daily Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
        
        {/* Day Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist">
          {itinerary.days.map((day, idx) => {
            const isActive = idx === activeDayIndex;
            return (
              <button
                key={day.dayNumber}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shrink-0 ${
                  isActive
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                Day {day.dayNumber}
              </button>
            );
          })}
        </div>

        {/* Action Buttons for Day */}
        <div className="flex items-center gap-2">
          {/* Open full route in Google Maps */}
          <a
            href={fullDayRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-md transition-colors"
          >
            <Navigation2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Google Maps Route</span>
          </a>

          {/* Open City in Google Earth 3D */}
          <a
            href={buildGoogleEarthUrl(itinerary.destination.coordinates.lat, itinerary.destination.coordinates.lng, 900, 60)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-sky-900 dark:text-sky-200 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900 border border-sky-200 dark:border-sky-800 rounded-md transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Google Earth 3D</span>
          </a>

          {/* Mobile Sync / QR */}
          <button
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 rounded-md transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Sync to Phone</span>
          </button>
        </div>

      </div>

      {/* Day Overview Banner */}
      <div className="bg-stone-100/50 dark:bg-stone-900/40 rounded-xl p-5 mb-8 border border-stone-200/80 dark:border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold mb-1">
              Day {activeDay.dayNumber} Theme
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 dark:text-stone-50">
              {activeDay.theme}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1">
              {activeDay.summary}
            </p>
          </div>

          {/* Quick Metrics Bar (Zero-pill discipline: unboxed metadata) */}
          <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-stone-200 dark:border-stone-800 md:pl-5 shrink-0">
            <div>
              <span className="block text-sm font-semibold text-stone-900 dark:text-stone-100">
                {dayStats.totalActivities}
              </span>
              <span>Experiences</span>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span className="block text-sm font-semibold text-stone-900 dark:text-stone-100">
                {dayStats.diningCount}
              </span>
              <span>Dining Stops</span>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span className="block text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-amber-600" />
                ~{dayStats.estimatedWalkingMinutes} min
              </span>
              <span>Scenic Walking</span>
            </div>
          </div>
        </div>

        {/* Dining Mix Indicator Bar */}
        <div className="mt-4 pt-3 border-t border-stone-200/70 dark:border-stone-800/70 flex flex-wrap items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
          <span className="font-semibold text-stone-900 dark:text-stone-200 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            Curated Dining Mix:
          </span>
          <span className={diningMix.hasStreetOrMarket ? 'text-amber-800 dark:text-amber-300 font-medium' : 'text-stone-400'}>
            ✓ Street Food & Markets
          </span>
          <span aria-hidden="true">·</span>
          <span className={diningMix.hasHiddenGem ? 'text-amber-800 dark:text-amber-300 font-medium' : 'text-stone-400'}>
            ✓ Hidden Local Gems
          </span>
          <span aria-hidden="true">·</span>
          <span className={diningMix.hasUpscale ? 'text-amber-800 dark:text-amber-300 font-medium' : 'text-stone-400'}>
            ✓ Upscale / Haute Tables
          </span>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-6">
        {activeDay.items.map((item, index) => {
          const isDining = item.category === 'dining' || item.category === 'market';
          const reservation = reservations[item.id] || { status: 'unreserved' };
          const singleMapUrl = buildSingleLocationMapUrl(item.locationName, itinerary.destination.city, item.coordinates);

          return (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700/60 rounded-xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md"
            >
              {/* Transition distance indicator from previous stop */}
              {item.distanceFromPrev && index > 0 && (
                <div className="flex items-center gap-2 text-[11px] text-stone-400 dark:text-stone-500 mb-4 pb-2 border-b border-stone-100 dark:border-stone-800/60">
                  <Footprints className="w-3 h-3 text-amber-600" />
                  <span>Transit from previous stop: {item.distanceFromPrev}</span>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Left Content */}
                <div className="space-y-2 max-w-3xl">
                  
                  {/* Clean unboxed metadata strip */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                      <Clock className="w-3.5 h-3.5" />
                      {item.time} ({item.durationMinutes} min)
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize font-medium text-stone-700 dark:text-stone-300">
                      {item.diningType ? getDiningLabel(item.diningType) : item.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.priceEstimate}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {item.neighborhood}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100">
                      {item.title}
                    </h3>
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                      {item.locationName}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-light">
                    {item.description}
                  </p>

                  {/* Signature Dish / Highlight (if present) */}
                  {item.signatureDish && (
                    <div className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40">
                      <span className="font-semibold text-amber-950 dark:text-amber-300">Signature To Order: </span>
                      <span>{item.signatureDish}</span>
                    </div>
                  )}

                  {/* Anticipatory Concierge Tip */}
                  <div className="text-xs text-stone-600 dark:text-stone-300 italic pt-1 flex items-start gap-2">
                    <span className="text-amber-500 font-serif not-italic font-bold">◇</span>
                    <span>
                      <strong className="not-italic font-medium text-stone-800 dark:text-stone-200">
                        Concierge Note:
                      </strong>{' '}
                      {item.insiderTip}
                    </span>
                  </div>

                </div>

                {/* Right Interactive Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-between gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800">
                  
                  {/* Direct Navigation & Google Earth Buttons */}
                  <div className="flex items-center gap-1.5 w-full">
                    <a
                      href={singleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-lg transition-colors"
                    >
                      <Navigation2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </a>

                    <a
                      href={buildGoogleEarthUrl(item.coordinates.lat, item.coordinates.lng, 650, 60)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-sky-800 dark:text-sky-200 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 border border-sky-200 dark:border-sky-800 rounded-lg transition-colors"
                      title="Fly to venue in Google Earth 3D"
                    >
                      <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      <span>Earth 3D</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  </div>

                  {/* Booking Platform Reservation Action */}
                  <div className="flex items-center gap-1">
                    <a
                      href={item.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 rounded-lg shadow-2xs transition-colors"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Reserve on {item.bookingPlatform}</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>

                  {/* In-App Reservation Status Toggle */}
                  <div className="flex items-center justify-end gap-1 text-[11px]">
                    <span className="text-stone-400">Status:</span>
                    <button
                      onClick={() =>
                        updateReservation(
                          item.id,
                          reservation.status === 'confirmed'
                            ? 'unreserved'
                            : reservation.status === 'requested'
                            ? 'confirmed'
                            : 'requested'
                        )
                      }
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all ${
                        reservation.status === 'confirmed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : reservation.status === 'requested'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {reservation.status === 'confirmed'
                        ? 'Confirmed ✓'
                        : reservation.status === 'requested'
                        ? 'Requested · Waiting'
                        : 'Tap to Mark Booked'}
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation Strip */}
      <div className="mt-12 p-6 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
            Seamless Journey Continues
          </div>
          <div className="text-lg font-editorial font-bold text-stone-900 dark:text-stone-100">
            Explore Day Route on Interactive Map or Chat with Concierge
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('map')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:opacity-90 transition-opacity"
          >
            Open Interactive Map
          </button>
          <button
            onClick={() => setActiveTab('concierge')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg transition-colors"
          >
            Ask AI Concierge
          </button>
        </div>
      </div>

    </div>
  );
};
