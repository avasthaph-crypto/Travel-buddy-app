/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Navigation } from './components/Navigation';
import { ItineraryDashboard } from './components/ItineraryDashboard';
import { InteractiveMapDirections } from './components/InteractiveMapDirections';
import { DiningMixPortfolio } from './components/DiningMixPortfolio';
import { ReservationsManager } from './components/ReservationsManager';
import { AiConciergeChat } from './components/AiConciergeChat';
import { GoogleEarthExplorer } from './components/GoogleEarthExplorer';
import { ProfileBuilder } from './components/ProfileBuilder';
import { DeviceSyncModal } from './components/DeviceSyncModal';
import { WifiOff, Compass, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, isOffline, itinerary, setShowProfileModal } = useTravel();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      
      {/* Top Header */}
      <Navigation />

      {/* Offline Mode Banner */}
      {isOffline && (
        <div className="bg-amber-500/10 dark:bg-amber-400/10 border-b border-amber-500/20 py-2.5 px-4 text-center text-xs text-amber-900 dark:text-amber-200">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold">Offline Sanctuary Mode:</span>
            <span>All itinerary stops, addresses, coordinates, and concierge guidance are accessible without cellular reception.</span>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'itinerary' && <ItineraryDashboard />}
        {activeTab === 'map' && <InteractiveMapDirections />}
        {activeTab === 'earth' && <GoogleEarthExplorer />}
        {activeTab === 'dining' && <DiningMixPortfolio />}
        {activeTab === 'reservations' && <ReservationsManager />}
        {activeTab === 'concierge' && <AiConciergeChat />}
      </main>

      {/* Modals */}
      <ProfileBuilder />
      <DeviceSyncModal />

      {/* Luxury Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-950/50 py-8 px-4 sm:px-6 lg:px-8 text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
              AETHERIA
            </span>
            <span aria-hidden="true">·</span>
            <span>Bespoke Hyper-Personalized Travel Concierge</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setShowProfileModal(true)}
              className="hover:text-stone-900 dark:hover:text-stone-100 underline transition-colors"
            >
              Change Destination ({itinerary.destination.city})
            </button>
            <span aria-hidden="true">·</span>
            <span>Google Maps Ground Support</span>
            <span aria-hidden="true">·</span>
            <span>Encrypted Local Vault</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <MainContent />
    </TravelProvider>
  );
}
