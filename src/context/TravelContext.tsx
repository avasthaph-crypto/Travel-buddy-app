import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Destination, GuestProfile, Itinerary, WeatherData } from '../types/travel';
import { GLOBAL_DESTINATIONS, PROFILE_PRESETS } from '../data/destinations';
import { generateCuratedItinerary } from '../data/curatedItineraries';
import { deserializeOfflineItinerary, serializeItineraryForOffline } from '../utils/rules';

export type NavigationTab = 'itinerary' | 'map' | 'earth' | 'dining' | 'reservations' | 'concierge';

interface TravelContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  activeDestination: Destination;
  setActiveDestination: (dest: Destination) => void;
  guestProfile: GuestProfile;
  setGuestProfile: React.Dispatch<React.SetStateAction<GuestProfile>>;
  durationDays: number;
  setDurationDays: (days: number) => void;
  itinerary: Itinerary;
  setItinerary: React.Dispatch<React.SetStateAction<Itinerary>>;
  activeDayIndex: number;
  setActiveDayIndex: (index: number) => void;
  isOffline: boolean;
  toggleOfflineMode: () => void;
  weather: WeatherData | null;
  isLoadingWeather: boolean;
  isGeneratingItinerary: boolean;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  reservations: Record<string, { status: 'unreserved' | 'requested' | 'confirmed'; notes?: string; timeSlot?: string }>;
  updateReservation: (activityId: string, status: 'unreserved' | 'requested' | 'confirmed', notes?: string, timeSlot?: string) => void;
  createItinerary: (dest?: Destination, profile?: GuestProfile, days?: number) => Promise<void>;
  savedItineraries: Itinerary[];
  saveCurrentItineraryLocally: () => void;
  loadSavedItinerary: (itin: Itinerary) => void;
  syncItineraryToCloud: () => Promise<string>;
  loadItineraryFromCloud: (code: string) => Promise<boolean>;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  showSyncModal: boolean;
  setShowSyncModal: (show: boolean) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CURRENT = 'aetheria_current_itinerary';
const LOCAL_STORAGE_KEY_SAVED = 'aetheria_saved_itineraries';
const LOCAL_STORAGE_KEY_PROFILE = 'aetheria_guest_profile';
const LOCAL_STORAGE_KEY_THEME = 'aetheria_dark_mode';
const LOCAL_STORAGE_KEY_RESERVATIONS = 'aetheria_reservations';

export const TravelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, String(darkMode));
  }, [darkMode]);

  // Online / Offline State
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineMode = () => {
    setIsOffline((prev) => !prev);
  };

  // Active Destination & Profile
  const [activeDestination, setActiveDestination] = useState<Destination>(GLOBAL_DESTINATIONS[0]);
  const [guestProfile, setGuestProfile] = useState<GuestProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return PROFILE_PRESETS[0].profile;
  });

  const [durationDays, setDurationDays] = useState<number>(3);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<NavigationTab>('itinerary');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);

  // Initial Itinerary initialization
  const [itinerary, setItinerary] = useState<Itinerary>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT);
      if (saved) {
        const parsed = deserializeOfflineItinerary(saved);
        if (parsed) return parsed;
      }
    }
    return generateCuratedItinerary(GLOBAL_DESTINATIONS[0], PROFILE_PRESETS[0].profile, 3);
  });

  // Saved itineraries list
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SAVED);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return [];
  });

  // Reservations tracker
  const [reservations, setReservations] = useState<
    Record<string, { status: 'unreserved' | 'requested' | 'confirmed'; notes?: string; timeSlot?: string }>
  >(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_RESERVATIONS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return {};
  });

  const updateReservation = (
    activityId: string,
    status: 'unreserved' | 'requested' | 'confirmed',
    notes?: string,
    timeSlot?: string
  ) => {
    setReservations((prev) => {
      const updated = {
        ...prev,
        [activityId]: { status, notes, timeSlot },
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESERVATIONS, JSON.stringify(updated));
      return updated;
    });
  };

  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState<boolean>(false);

  // Fetch weather for active destination
  const fetchWeather = useCallback(async (destination: Destination) => {
    setIsLoadingWeather(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(destination.id)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const raw = json.data;
          const current = raw.current || {};
          const daily = raw.daily || {};

          const mapped: WeatherData = {
            city: destination.city,
            current: {
              temp: Math.round(current.temperature_2m ?? 22),
              feelsLike: Math.round(current.apparent_temperature ?? 22),
              humidity: Math.round(current.relative_humidity_2m ?? 50),
              condition: current.weather_code !== undefined ? String(current.weather_code) : 'Pleasant',
              windSpeed: Math.round(current.wind_speed_10m ?? 10),
              weatherCode: current.weather_code ?? 1,
            },
            daily: (daily.time || ['Day 1', 'Day 2', 'Day 3']).map((dayStr: string, idx: number) => ({
              day: `Day ${idx + 1}`,
              tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? 24),
              tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? 16),
              precipProb: Math.round(daily.precipitation_probability_max?.[idx] ?? 10),
              condition: 'Partly Sunny',
              weatherCode: daily.weather_code?.[idx] ?? 1,
              uvIndex: Math.round(daily.uv_index_max?.[idx] ?? 6),
            })),
          };
          setWeather(mapped);
          setIsLoadingWeather(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Weather fetch fallback triggered:', err);
    }

    // Default rich weather fallback
    setWeather({
      city: destination.city,
      current: {
        temp: 22,
        feelsLike: 21,
        humidity: 55,
        condition: 'Soft Sunlight',
        windSpeed: 12,
        weatherCode: 1,
      },
      daily: [
        { day: 'Day 1', tempMax: 24, tempMin: 16, precipProb: 10, condition: 'Clear Azure', weatherCode: 1, uvIndex: 6 },
        { day: 'Day 2', tempMax: 23, tempMin: 15, precipProb: 20, condition: 'Gentle Breezes', weatherCode: 2, uvIndex: 6 },
        { day: 'Day 3', tempMax: 21, tempMin: 14, precipProb: 35, condition: 'Silken Afternoon Rain', weatherCode: 61, uvIndex: 5 },
      ],
    });
    setIsLoadingWeather(false);
  }, []);

  // Sync active destination weather
  useEffect(() => {
    fetchWeather(activeDestination);
  }, [activeDestination, fetchWeather]);

  // Persist current itinerary and profile to LocalStorage
  useEffect(() => {
    if (itinerary) {
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT, serializeItineraryForOffline(itinerary));
    }
  }, [itinerary]);

  useEffect(() => {
    if (guestProfile) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(guestProfile));
    }
  }, [guestProfile]);

  // Generate Itinerary (AI with Curated Fallback)
  const createItinerary = async (dest?: Destination, profile?: GuestProfile, daysCount?: number) => {
    const targetDest = dest || activeDestination;
    const targetProfile = profile || guestProfile;
    const targetDays = daysCount || durationDays;

    setIsGeneratingItinerary(true);

    try {
      // Attempt AI backend endpoint with fast 3s timeout
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
        body: JSON.stringify({
          destination: targetDest,
          profile: targetProfile,
          durationDays: targetDays,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.itinerary) {
          const aiItin = json.itinerary;
          const fullItinerary: Itinerary = {
            id: `itin-${targetDest.id}-${Date.now().toString(36)}`,
            tripTitle: aiItin.tripTitle || `${targetDest.city} Tailored Symphony`,
            destination: targetDest,
            profile: targetProfile,
            durationDays: targetDays,
            startDate: new Date().toISOString().split('T')[0],
            summary: aiItin.summary || 'A curated journey tailored to your distinct travel profile.',
            conciergePreamble: aiItin.conciergePreamble || 'Anticipating your arrival with tailored reservations.',
            culturalEtiquette: aiItin.culturalEtiquette || targetDest.culturalEtiquette,
            days: aiItin.days || [],
            createdAt: new Date().toISOString(),
            syncCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
            offlineReady: true,
          };
          setItinerary(fullItinerary);
          setActiveDestination(targetDest);
          setActiveDayIndex(0);
          setIsGeneratingItinerary(false);
          return;
        }
      }
    } catch (err) {
      console.warn('AI endpoint unavailable or offline, building from bespoke curated engine:', err);
    }

    // Curated high-fidelity bespoke engine
    const curated = generateCuratedItinerary(targetDest, targetProfile, targetDays);
    setItinerary(curated);
    setActiveDestination(targetDest);
    setActiveDayIndex(0);
    setIsGeneratingItinerary(false);
  };

  const saveCurrentItineraryLocally = () => {
    setSavedItineraries((prev) => {
      const exists = prev.some((it) => it.id === itinerary.id);
      const updated = exists ? prev.map((it) => (it.id === itinerary.id ? itinerary : it)) : [itinerary, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEY_SAVED, JSON.stringify(updated));
      return updated;
    });
  };

  const loadSavedItinerary = (itin: Itinerary) => {
    setItinerary(itin);
    setActiveDestination(itin.destination);
    setGuestProfile(itin.profile);
    setDurationDays(itin.durationDays);
    setActiveDayIndex(0);
  };

  const syncItineraryToCloud = async (): Promise<string> => {
    try {
      const res = await fetch('/api/sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: itinerary.syncCode,
          itinerary,
        }),
      });
      if (res.ok) {
        return itinerary.syncCode;
      }
    } catch (err) {
      console.warn('Sync to cloud server offline, using local code:', err);
    }
    return itinerary.syncCode;
  };

  const loadItineraryFromCloud = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/sync/get?code=${encodeURIComponent(code.trim().toUpperCase())}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.itinerary) {
          setItinerary(json.itinerary);
          setActiveDestination(json.itinerary.destination);
          setGuestProfile(json.itinerary.profile);
          setDurationDays(json.itinerary.durationDays);
          setActiveDayIndex(0);
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to load itinerary from cloud:', err);
    }
    return false;
  };

  // URL hash sync support on initial mount (e.g. #sync=ABCDEF)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const match = hash.match(/sync=([A-Za-z0-9]+)/);
      if (match && match[1]) {
        loadItineraryFromCloud(match[1]);
      }
    }
  }, []);

  return (
    <TravelContext.Provider
      value={{
        darkMode,
        setDarkMode,
        activeDestination,
        setActiveDestination,
        guestProfile,
        setGuestProfile,
        durationDays,
        setDurationDays,
        itinerary,
        setItinerary,
        activeDayIndex,
        setActiveDayIndex,
        isOffline,
        toggleOfflineMode,
        weather,
        isLoadingWeather,
        isGeneratingItinerary,
        activeTab,
        setActiveTab,
        reservations,
        updateReservation,
        createItinerary,
        savedItineraries,
        saveCurrentItineraryLocally,
        loadSavedItinerary,
        syncItineraryToCloud,
        loadItineraryFromCloud,
        showProfileModal,
        setShowProfileModal,
        showSyncModal,
        setShowSyncModal,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
