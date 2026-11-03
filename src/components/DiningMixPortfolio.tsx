import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { ActivityItem, DiningCategory } from '../types/travel';
import { buildSingleLocationMapUrl } from '../utils/rules';
import { 
  UtensilsCrossed, 
  MapPin, 
  Clock, 
  CalendarCheck, 
  ExternalLink, 
  Navigation, 
  Sparkles, 
  SlidersHorizontal,
  Flame,
  Store,
  Compass,
  Wine,
  Coffee
} from 'lucide-react';

export const DiningMixPortfolio: React.FC = () => {
  const { itinerary, reservations, updateReservation } = useTravel();
  const [filter, setFilter] = useState<string>('all');

  // Collect all dining & market items across all days
  const allDiningItems: Array<{ item: ActivityItem; dayNumber: number }> = [];

  itinerary.days.forEach((day) => {
    day.items.forEach((item) => {
      if (item.category === 'dining' || item.category === 'market' || item.diningType) {
        allDiningItems.push({ item, dayNumber: day.dayNumber });
      }
    });
  });

  const filteredItems = allDiningItems.filter(({ item }) => {
    if (filter === 'all') return true;
    return item.diningType === filter;
  });

  const getCategoryMeta = (type?: DiningCategory) => {
    switch (type) {
      case 'street_food':
        return { label: 'Street Food Gem', icon: Flame, color: 'text-orange-600 dark:text-orange-400' };
      case 'local_market':
        return { label: 'Bustling Local Market', icon: Store, color: 'text-amber-600 dark:text-amber-400' };
      case 'hidden_gem':
        return { label: 'Hidden Local Gem / Speakeasy', icon: Compass, color: 'text-indigo-600 dark:text-indigo-400' };
      case 'upscale_restaurant':
        return { label: 'Upscale / Haute Counter', icon: Wine, color: 'text-rose-600 dark:text-rose-400' };
      case 'artisan_cafe':
        return { label: 'Artisan Cafe / Tea Salon', icon: Coffee, color: 'text-emerald-600 dark:text-emerald-400' };
      default:
        return { label: 'Culinary Stop', icon: UtensilsCrossed, color: 'text-stone-600' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold mb-1">
            Curated Gastronomic Journey
          </div>
          <h1 className="text-3xl font-editorial font-bold text-stone-900 dark:text-stone-50">
            {itinerary.destination.city} Dining Portfolio
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            A balanced mix spanning sizzling street counters and morning markets to clandestine izakayas and Michelin-starred culinary summits.
          </p>
        </div>

        <div className="text-xs text-stone-500 dark:text-stone-400">
          Showing <span className="font-semibold text-stone-900 dark:text-stone-100">{filteredItems.length}</span> curated establishments
        </div>
      </div>

      {/* Filter Segmented Controls (Button tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8" role="tablist" aria-label="Dining categories">
        {[
          { id: 'all', label: 'All Curations' },
          { id: 'street_food', label: 'Street Food Gems' },
          { id: 'local_market', label: 'Bustling Markets' },
          { id: 'hidden_gem', label: 'Hidden Gems & Speakeasies' },
          { id: 'upscale_restaurant', label: 'Upscale & Haute Tables' },
          { id: 'artisan_cafe', label: 'Artisan Cafes' },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shrink-0 ${
                isActive
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200/60 dark:border-stone-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map(({ item, dayNumber }) => {
          const meta = getCategoryMeta(item.diningType);
          const Icon = meta.icon;
          const reservation = reservations[item.id] || { status: 'unreserved' };
          const mapUrl = buildSingleLocationMapUrl(item.locationName, itinerary.destination.city, item.coordinates);

          return (
            <div
              key={`${item.id}-day-${dayNumber}`}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-400/80 dark:hover:border-amber-600/60 rounded-2xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Header Meta Strip */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Icon className={`w-4 h-4 ${meta.color}`} />
                    <span className="font-semibold text-stone-900 dark:text-stone-200">{meta.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Day {dayNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.time}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium">{item.priceEstimate}</span>
                  </div>
                </div>

                {/* Title & Neighborhood */}
                <div>
                  <h3 className="text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100">
                    {item.title}
                  </h3>
                  <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{item.locationName} · {item.neighborhood}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-light">
                  {item.description}
                </p>

                {/* Signature Dish Spotlight */}
                {item.signatureDish && (
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                    <div className="font-semibold text-amber-950 dark:text-amber-300 mb-0.5">
                      Signature Creation:
                    </div>
                    <div className="text-stone-700 dark:text-stone-300 font-serif italic text-[13px]">
                      "{item.signatureDish}"
                    </div>
                  </div>
                )}

                {/* Anticipatory Tip */}
                <div className="text-xs text-stone-600 dark:text-stone-400 italic flex items-start gap-2 pt-1">
                  <span className="text-amber-500 font-serif not-italic">◇</span>
                  <span>
                    <strong className="not-italic font-medium text-stone-800 dark:text-stone-200">
                      Sommelier & Concierge Note:
                    </strong>{' '}
                    {item.insiderTip}
                  </span>
                </div>

              </div>

              {/* Card Footer: Booking Platform & Directions */}
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Reservation Link */}
                <a
                  href={item.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 rounded-lg shadow-2xs transition-colors"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Reserve Table ({item.bookingPlatform})</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                {/* Directions Link & Status Toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    title="View route in Google Maps"
                  >
                    <Navigation className="w-4 h-4 text-amber-600" />
                  </a>

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
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      reservation.status === 'confirmed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : reservation.status === 'requested'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {reservation.status === 'confirmed'
                      ? 'Confirmed Table'
                      : reservation.status === 'requested'
                      ? 'Requested'
                      : 'Mark Booked'}
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
