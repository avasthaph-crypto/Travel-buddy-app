import React from 'react';
import { useTravel, NavigationTab } from '../context/TravelContext';
import { 
  Compass, 
  MapPin, 
  UtensilsCrossed, 
  MessageSquareText, 
  CalendarCheck2, 
  Moon, 
  Sun, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  SlidersHorizontal,
  BookmarkCheck,
  Globe
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    darkMode, 
    setDarkMode, 
    isOffline, 
    toggleOfflineMode,
    itinerary,
    setShowProfileModal,
    setShowSyncModal,
    saveCurrentItineraryLocally,
  } = useTravel();

  const [savedNotice, setSavedNotice] = React.useState(false);

  const handleSave = () => {
    saveCurrentItineraryLocally();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const navItems: Array<{ id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'itinerary', label: 'Daily Itinerary', icon: Compass },
    { id: 'map', label: 'Route & Navigation', icon: MapPin },
    { id: 'earth', label: 'Google Earth 3D', icon: Globe },
    { id: 'dining', label: 'Dining Portfolio', icon: UtensilsCrossed },
    { id: 'reservations', label: 'Reservations', icon: CalendarCheck2 },
    { id: 'concierge', label: '24/7 AI Concierge', icon: MessageSquareText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Active Destination */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('itinerary')}
              className="text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
            >
              <span className="block text-xs uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400 font-medium">
                Haute Private Travel
              </span>
              <span className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
                AETHERIA
              </span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 pl-4 border-l border-stone-200 dark:border-stone-800">
              <span className="font-medium text-stone-800 dark:text-stone-200">
                {itinerary.destination.city}, {itinerary.destination.country}
              </span>
              <span aria-hidden="true">·</span>
              <span>{itinerary.durationDays} Days</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{itinerary.profile.tier.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Center Navigation Tabs (Segmented Control) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-stone-200/60 dark:bg-stone-900/80 rounded-lg border border-stone-200/80 dark:border-stone-800" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Customize Profile Trigger */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-md transition-colors"
              title="Change destination or guest profile"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile & Cities</span>
            </button>

            {/* Cross-Device Sync Modal Trigger */}
            <button
              onClick={() => setShowSyncModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 rounded-md transition-colors"
              title="Sync itinerary with mobile phone or tablet"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Mobile Sync</span>
            </button>

            {/* Offline Mode Toggle Button */}
            <button
              onClick={toggleOfflineMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                isOffline
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border-stone-200 dark:border-stone-800'
              }`}
              title={isOffline ? 'Offline Mode active (Data loaded from local vault)' : 'Online Mode (Click to test offline readiness)'}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="hidden md:inline">Offline Vault</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden md:inline">Live Sync</span>
                </>
              )}
            </button>

            {/* Save Trip Locally */}
            <button
              onClick={handleSave}
              className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 rounded-md border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
              title="Save itinerary to device bookmarks"
              aria-label="Save current itinerary locally"
            >
              <BookmarkCheck className={`w-4 h-4 ${savedNotice ? 'text-amber-600' : ''}`} />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 rounded-md border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
              title={darkMode ? 'Switch to daylight view' : 'Switch to night mode (dim ambient lighting)'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Strip (Bottom or sub-bar) */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-stone-200 dark:border-stone-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-amber-700 dark:text-amber-400 font-semibold'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.id === 'earth' ? 'Earth 3D' : item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
