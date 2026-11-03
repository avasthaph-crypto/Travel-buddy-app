import React, { useState, useRef, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { GLOBAL_DESTINATIONS, createCustomDestination } from '../data/destinations';
import { Destination } from '../types/travel';
import { buildGoogleEarthUrl, buildGoogleEarthSearchUrl } from '../utils/rules';
import { 
  Globe, 
  Search, 
  ExternalLink, 
  Compass, 
  MapPin, 
  Layers, 
  Sparkles, 
  Eye, 
  Maximize2, 
  RotateCw, 
  ArrowUpRight,
  Send,
  Navigation
} from 'lucide-react';

// Extended global catalog so any country and city can be explored
interface GlobalLocation {
  id: string;
  name: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
  altitude: number;
  tilt: number;
  highlight: string;
}

const GLOBAL_EARTH_LOCATIONS: GlobalLocation[] = [
  // Asia
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', continent: 'Asia', lat: 35.6762, lng: 139.6503, altitude: 800, tilt: 60, highlight: 'Shibuya Sky & Meiji Forest 3D' },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', continent: 'Asia', lat: 35.0116, lng: 135.7681, altitude: 600, tilt: 55, highlight: 'Higashiyama Cedar Hills & Temples' },
  { id: 'osaka', name: 'Osaka', country: 'Japan', continent: 'Asia', lat: 34.6937, lng: 135.5023, altitude: 750, tilt: 55, highlight: 'Dotonbori Canals & Castle Keep' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', continent: 'Asia', lat: 13.7563, lng: 100.5018, altitude: 900, tilt: 50, highlight: 'Chao Phraya River & Wat Arun' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', continent: 'Asia', lat: -8.4095, lng: 115.1889, altitude: 1200, tilt: 45, highlight: 'Tegallalang Terraces & Volcanoes' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', continent: 'Asia', lat: 1.3521, lng: 103.8198, altitude: 650, tilt: 60, highlight: 'Marina Bay Sands & Supertree Grove' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', continent: 'Asia', lat: 37.5665, lng: 126.9780, altitude: 850, tilt: 55, highlight: 'Namsan Mountain & Gyeongbokgung' },
  { id: 'hongkong', name: 'Hong Kong', country: 'China', continent: 'Asia', lat: 22.3193, lng: 114.1694, altitude: 700, tilt: 65, highlight: 'Victoria Peak & Harbor Skyline' },
  
  // Europe
  { id: 'paris', name: 'Paris', country: 'France', continent: 'Europe', lat: 48.8566, lng: 2.3522, altitude: 700, tilt: 55, highlight: 'Eiffel Tower, Seine & Haussmann Boulevards' },
  { id: 'nice', name: 'Nice', country: 'France', continent: 'Europe', lat: 43.7102, lng: 7.2620, altitude: 800, tilt: 50, highlight: 'Promenade des Anglais & Baie des Anges' },
  { id: 'rome', name: 'Rome', country: 'Italy', continent: 'Europe', lat: 41.9028, lng: 12.4964, altitude: 650, tilt: 55, highlight: 'Colosseum, Roman Forum & Tiber River' },
  { id: 'florence', name: 'Florence', country: 'Italy', continent: 'Europe', lat: 43.7696, lng: 11.2558, altitude: 550, tilt: 55, highlight: 'Brunelleschi Duomo & Ponte Vecchio' },
  { id: 'amalfi', name: 'Amalfi Coast', country: 'Italy', continent: 'Europe', lat: 40.6340, lng: 14.6027, altitude: 900, tilt: 65, highlight: 'Dramatic Cliffside Pastel Villages' },
  { id: 'santorini', name: 'Santorini', country: 'Greece', continent: 'Europe', lat: 36.3932, lng: 25.4615, altitude: 650, tilt: 60, highlight: 'White Cliffside Caldera & Blue Domes' },
  { id: 'athens', name: 'Athens', country: 'Greece', continent: 'Europe', lat: 37.9838, lng: 23.7275, altitude: 550, tilt: 55, highlight: 'Acropolis Parthenon & Ancient Agora' },
  { id: 'reykjavik', name: 'Reykjavik', country: 'Iceland', continent: 'Europe', lat: 64.1466, lng: -21.9426, altitude: 750, tilt: 50, highlight: 'Hallgrímskirkja & Volcanic Coastline' },
  { id: 'london', name: 'London', country: 'United Kingdom', continent: 'Europe', lat: 51.5074, lng: -0.1278, altitude: 800, tilt: 55, highlight: 'Big Ben, Thames & Tower Bridge' },
  { id: 'edinburgh', name: 'Edinburgh', country: 'United Kingdom', continent: 'Europe', lat: 55.9533, lng: -3.1883, altitude: 600, tilt: 60, highlight: 'Edinburgh Castle on Extinct Volcano' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', continent: 'Europe', lat: 41.3879, lng: 2.1699, altitude: 750, tilt: 60, highlight: 'Sagrada Família & Gothic Quarter' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', continent: 'Europe', lat: 40.4168, lng: -3.7038, altitude: 800, tilt: 50, highlight: 'Palacio Real & Gran Vía' },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', continent: 'Europe', lat: 38.7223, lng: -9.1393, altitude: 700, tilt: 60, highlight: 'Belém Tower, Alfama Hills & Tagus River' },
  { id: 'vienna', name: 'Vienna', country: 'Austria', continent: 'Europe', lat: 48.2082, lng: 16.3738, altitude: 650, tilt: 55, highlight: 'Schönbrunn Palace & Ringstraße Grandeur' },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', continent: 'Europe', lat: 47.3769, lng: 8.5417, altitude: 850, tilt: 55, highlight: 'Lake Zurich & Alpine Foothills' },
  { id: 'zermatt', name: 'Zermatt (Matterhorn)', country: 'Switzerland', continent: 'Europe', lat: 45.9765, lng: 7.7491, altitude: 1500, tilt: 70, highlight: 'Matterhorn Alpine 3D Relief' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', continent: 'Europe', lat: 52.3676, lng: 4.9041, altitude: 600, tilt: 50, highlight: 'Concentric Historic Canal Belt' },

  // Americas
  { id: 'newyork', name: 'New York', country: 'United States', continent: 'Americas', lat: 40.7128, lng: -74.0060, altitude: 850, tilt: 65, highlight: 'Manhattan Canyon & Central Park' },
  { id: 'sanfrancisco', name: 'San Francisco', country: 'United States', continent: 'Americas', lat: 37.7749, lng: -122.4194, altitude: 900, tilt: 60, highlight: 'Golden Gate Bridge & Bay Hills' },
  { id: 'neworleans', name: 'New Orleans', country: 'United States', continent: 'Americas', lat: 29.9511, lng: -90.0715, altitude: 700, tilt: 45, highlight: 'Mississippi River & French Quarter' },
  { id: 'oaxaca', name: 'Oaxaca', country: 'Mexico', continent: 'Americas', lat: 17.0732, lng: -96.7266, altitude: 800, tilt: 55, highlight: 'Monte Albán Zapotec Terraces & Zócalo' },
  { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', continent: 'Americas', lat: -22.9068, lng: -43.1729, altitude: 1200, tilt: 65, highlight: 'Christ the Redeemer & Sugarloaf Mountain' },
  { id: 'cusco', name: 'Cusco (Machu Picchu)', country: 'Peru', continent: 'Americas', lat: -13.1631, lng: -72.5450, altitude: 2000, tilt: 70, highlight: 'Andean Mountain Citadel in 3D' },

  // Middle East & Africa
  { id: 'dubai', name: 'Dubai', country: 'UAE', continent: 'Middle East', lat: 25.2048, lng: 55.2708, altitude: 950, tilt: 65, highlight: 'Burj Khalifa & Palm Jumeirah Archipelago' },
  { id: 'abudhabi', name: 'Abu Dhabi', country: 'UAE', continent: 'Middle East', lat: 24.4539, lng: 54.3773, altitude: 850, tilt: 50, highlight: 'Sheikh Zayed Grand Mosque & Louvre Island' },
  { id: 'petra', name: 'Petra', country: 'Jordan', continent: 'Middle East', lat: 30.3285, lng: 35.4444, altitude: 900, tilt: 65, highlight: 'Rose-Red Nabataean Treasury & Desert Siq' },
  { id: 'marrakech', name: 'Marrakech', country: 'Morocco', continent: 'Africa', lat: 31.6295, lng: -7.9811, altitude: 800, tilt: 50, highlight: 'Medina Labyrinth & Atlas Mountains' },
  { id: 'cairo', name: 'Cairo (Giza)', country: 'Egypt', continent: 'Africa', lat: 29.9792, lng: 31.1342, altitude: 1100, tilt: 60, highlight: 'Great Pyramids of Giza & Nile Valley' },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', continent: 'Africa', lat: -1.2921, lng: 36.8219, altitude: 950, tilt: 50, highlight: 'Urban Skyline with Wildlife Savannah Background' },
  { id: 'capetown', name: 'Cape Town', country: 'South Africa', continent: 'Africa', lat: -33.9249, lng: 18.4241, altitude: 1300, tilt: 65, highlight: 'Table Mountain & Atlantic Coastline' },

  // Oceania
  { id: 'sydney', name: 'Sydney', country: 'Australia', continent: 'Oceania', lat: -33.8688, lng: 151.2093, altitude: 800, tilt: 60, highlight: 'Sydney Opera House & Harbor Bridge' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', continent: 'Oceania', lat: -37.8136, lng: 144.9631, altitude: 750, tilt: 55, highlight: 'Yarra River & Victorian Laneways' },
  { id: 'queenstown', name: 'Queenstown', country: 'New Zealand', continent: 'Oceania', lat: -45.0312, lng: 168.6626, altitude: 1400, tilt: 70, highlight: 'Southern Alps & Lake Wakatipu' },
];

export const GoogleEarthExplorer: React.FC = () => {
  const { itinerary, setActiveDestination, createItinerary, setActiveTab } = useTravel();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [activeLocation, setActiveLocation] = useState<GlobalLocation>(() => {
    const matched = GLOBAL_EARTH_LOCATIONS.find((l) => l.name.toLowerCase() === itinerary.destination.city.toLowerCase());
    return matched || GLOBAL_EARTH_LOCATIONS[0];
  });

  const [tilt, setTilt] = useState<number>(activeLocation.tilt || 55);
  const [altitude, setAltitude] = useState<number>(activeLocation.altitude || 800);
  const [heading, setHeading] = useState<number>(0);
  const [isRotating, setIsRotating] = useState(true);
  const [dragOffset, setDragOffset] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(0);

  // Filter locations based on continent and search
  const filteredLocations = GLOBAL_EARTH_LOCATIONS.filter((loc) => {
    const matchesContinent = selectedContinent === 'All' || loc.continent === selectedContinent;
    const matchesSearch =
      !searchQuery.trim() ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.highlight.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  // Direct Google Earth Web 3D URL
  const googleEarthUrl = buildGoogleEarthUrl(
    activeLocation.lat,
    activeLocation.lng,
    altitude,
    tilt,
    heading
  );

  // Google Earth Search URL for any arbitrary custom query
  const googleEarthSearchUrl = searchQuery.trim()
    ? buildGoogleEarthSearchUrl(searchQuery)
    : buildGoogleEarthSearchUrl(`${activeLocation.name}, ${activeLocation.country}`);

  // Canvas-based interactive 3D Earth representation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      const effectiveAngle = (angle + dragOffset) % 360;

      // Outer Atmospheric Glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.25);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      glowGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Earth Sphere Background (Deep Ocean Blue)
      const oceanGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      oceanGrad.addColorStop(0, '#1e3a8a');
      oceanGrad.addColorStop(0.7, '#0f172a');
      oceanGrad.addColorStop(1, '#020617');
      ctx.fillStyle = oceanGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Latitude Parallels
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        const y = centerY + Math.sin((lat * Math.PI) / 180) * radius;
        const rLat = Math.cos((lat * Math.PI) / 180) * radius;
        ctx.beginPath();
        ctx.ellipse(centerX, y, rLat, rLat * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude Meridians rotating
      const numMeridians = 12;
      for (let i = 0; i < numMeridians; i++) {
        const lon = (i * (360 / numMeridians) + effectiveAngle) % 360;
        const rad = (lon * Math.PI) / 180;
        const xOffset = Math.sin(rad) * radius;
        const isVisible = Math.cos(rad) > 0; // Front hemisphere

        if (isVisible) {
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, Math.abs(xOffset), radius, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
          ctx.stroke();
        }
      }

      // Plot Global City Pins on the rotating sphere
      GLOBAL_EARTH_LOCATIONS.forEach((loc) => {
        const relLng = ((loc.lng + effectiveAngle + 180) % 360) - 180;
        const radLng = (relLng * Math.PI) / 180;
        const radLat = (loc.lat * Math.PI) / 180;

        // Spherical projection
        const cosLat = Math.cos(radLat);
        const sinLat = Math.sin(radLat);
        const cosLng = Math.cos(radLng);
        const sinLng = Math.sin(radLng);

        // Front facing check
        if (cosLng > 0) {
          const x = centerX + sinLng * cosLat * radius;
          const y = centerY - sinLat * radius * 0.95;

          const isTarget = loc.id === activeLocation.id;

          // Draw marker
          ctx.beginPath();
          ctx.arc(x, y, isTarget ? 6 : 3, 0, Math.PI * 2);
          ctx.fillStyle = isTarget ? '#fbbf24' : 'rgba(255, 255, 255, 0.7)';
          ctx.fill();

          if (isTarget) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            ctx.font = '11px Plus Jakarta Sans, sans-serif';
            ctx.fillStyle = '#fde68a';
            ctx.fillText(loc.name, x + 8, y + 3);
          }
        }
      });

      // Sphere Edge Rim Lighting
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      if (isRotating && !isDraggingRef.current) {
        angle = (angle + 0.35) % 360;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeLocation, isRotating, dragOffset]);

  // Capture this city into the user's active travel itinerary
  const handleCaptureDestination = async (loc: GlobalLocation) => {
    setActiveLocation(loc);

    // Look for matching destination in GLOBAL_DESTINATIONS or build on the fly
    const existing = GLOBAL_DESTINATIONS.find((d) => d.id === loc.id);
    const destination: Destination = existing || {
      id: loc.id,
      city: loc.name,
      country: loc.country,
      region: loc.continent,
      continent: loc.continent as any,
      currency: 'Local Currency',
      currencySymbol: '$',
      language: 'English',
      timeZone: 'UTC',
      heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      climateNotes: 'Temperate and pleasant conditions for regional exploration.',
      bestSeason: 'Spring & Autumn',
      culturalEtiquette: [
        'Respect local community heritage and customs.',
        'Greet hospitality hosts warmly upon arrival.',
      ],
      coordinates: { lat: loc.lat, lng: loc.lng },
    };

    setActiveDestination(destination);
    await createItinerary(destination);
    setActiveTab('itinerary');
  };

  // Capture any custom country or city worldwide
  const handleCaptureCustomQuery = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/[,–-]/).map((p) => p.trim());
    const cityName = parts[0] || trimmed;
    const countryName = parts[1] || 'Global Destination';

    const customDest = createCustomDestination(
      cityName,
      countryName,
      selectedContinent !== 'All' ? (selectedContinent as any) : 'Europe'
    );

    const customLoc: GlobalLocation = {
      id: customDest.id,
      name: customDest.city,
      country: customDest.country,
      continent: customDest.continent,
      lat: customDest.coordinates.lat,
      lng: customDest.coordinates.lng,
      altitude: 800,
      tilt: 55,
      highlight: `3D Satellite & Photogrammetry across ${customDest.city}, ${customDest.country}`,
    };

    setActiveLocation(customLoc);
    setActiveDestination(customDest);
    await createItinerary(customDest);
    setActiveTab('itinerary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold mb-1">
            <Globe className="w-4 h-4 text-sky-500" />
            <span>Planetary 3D Geospatial Engine</span>
          </div>
          <h1 className="text-3xl font-editorial font-bold text-stone-900 dark:text-stone-50">
            Google Earth Global Explorer
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Capture all countries, cities, and landmarks worldwide with 3D terrain, tilt, elevation, and instant itinerary generation.
          </p>
        </div>

        {/* Global Action: Open active target in Google Earth 3D */}
        <div className="flex items-center gap-2">
          <a
            href={googleEarthUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 rounded-lg shadow-sm hover:opacity-90 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
            <span>Launch in Google Earth 3D</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* Worldwide Search & Continent Filter Bar */}
      <div className="bg-stone-100 dark:bg-stone-900/70 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Universal Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any country, city, or landmark worldwide (e.g. Kyoto, Positano, Serengeti, Reykjavík)..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
            />
          </div>

          {/* Quick Search on Google Earth */}
          {searchQuery.trim() && (
            <a
              href={googleEarthSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Search Earth</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Continent Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1" role="tablist">
          {['All', 'Europe', 'Asia', 'Americas', 'Middle East', 'Africa', 'Oceania'].map((continent) => {
            const isActive = selectedContinent === continent;
            return (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {continent}
              </button>
            );
          })}
        </div>

        {/* Quick Popular Destinations Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-stone-200/60 dark:border-stone-800/60">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold shrink-0 mr-1">
            Global Curations:
          </span>
          {['Tokyo', 'Paris', 'Santorini', 'Reykjavik', 'Petra', 'Cairo', 'Cape Town', 'Rio de Janeiro', 'Machu Picchu', 'Sydney'].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                const found = GLOBAL_EARTH_LOCATIONS.find((l) => l.name.toLowerCase().includes(name.toLowerCase()));
                if (found) {
                  setActiveLocation(found);
                  setTilt(found.tilt);
                  setAltitude(found.altitude);
                } else {
                  setSearchQuery(name);
                }
              }}
              className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-950 hover:text-amber-900 dark:hover:text-amber-200 transition-colors shrink-0"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left 3D Earth Globe & Controls, Right City Showcase & Capture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 3D Earth Globe Canvas & Real-Time Pitch/Tilt Controls */}
        <div className="lg:col-span-7 bg-stone-950 text-white rounded-2xl p-6 border border-stone-800 shadow-2xl relative overflow-hidden">
          
          {/* Header over Globe */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                Planetary View
              </div>
              <div className="text-xl font-editorial font-bold text-white">
                {activeLocation.name}, {activeLocation.country}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  isRotating
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-stone-900 border-stone-700 text-stone-400'
                }`}
                title={isRotating ? 'Pause rotation' : 'Resume rotation'}
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <a
                href={googleEarthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors"
                title="Launch 3D in Google Earth Web"
              >
                <Maximize2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Canvas Rotating Globe with Drag Rotation */}
          <div className="flex flex-col items-center my-4">
            <canvas
              ref={canvasRef}
              width={480}
              height={400}
              onMouseDown={(e) => {
                isDraggingRef.current = true;
                lastXRef.current = e.clientX;
              }}
              onMouseMove={(e) => {
                if (isDraggingRef.current) {
                  const delta = e.clientX - lastXRef.current;
                  lastXRef.current = e.clientX;
                  setDragOffset((prev) => prev + delta * 0.7);
                }
              }}
              onMouseUp={() => {
                isDraggingRef.current = false;
              }}
              onMouseLeave={() => {
                isDraggingRef.current = false;
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  isDraggingRef.current = true;
                  lastXRef.current = e.touches[0].clientX;
                }
              }}
              onTouchMove={(e) => {
                if (isDraggingRef.current && e.touches.length > 0) {
                  const delta = e.touches[0].clientX - lastXRef.current;
                  lastXRef.current = e.touches[0].clientX;
                  setDragOffset((prev) => prev + delta * 0.7);
                }
              }}
              onTouchEnd={() => {
                isDraggingRef.current = false;
              }}
              className="max-w-full cursor-grab active:cursor-grabbing select-none"
            />
            <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-1">
              <span>✦ Drag horizontally across the globe to rotate longitudes</span>
            </div>
          </div>

          {/* Interactive 3D Camera Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 text-xs">
            
            {/* Tilt Control */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                <span>Camera Tilt</span>
                <span className="font-mono text-amber-400">{tilt}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                value={tilt}
                onChange={(e) => setTilt(Number(e.target.value))}
                className="w-full accent-amber-400 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Altitude Control */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                <span>Altitude</span>
                <span className="font-mono text-amber-400">{altitude}m</span>
              </div>
              <input
                type="range"
                min="200"
                max="5000"
                step="100"
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
                className="w-full accent-amber-400 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Heading Control */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                <span>Compass Heading</span>
                <span className="font-mono text-amber-400">{heading}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={heading}
                onChange={(e) => setHeading(Number(e.target.value))}
                className="w-full accent-amber-400 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Coordinates Footer */}
          <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
            <span className="font-mono">
              LAT: {activeLocation.lat.toFixed(4)}° · LNG: {activeLocation.lng.toFixed(4)}°
            </span>
            <span className="text-amber-400">Photogrammetric 3D Available</span>
          </div>

        </div>

        {/* Right: City Highlights & Capture into Itinerary */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Target Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
                  {activeLocation.continent} · {activeLocation.country}
                </span>
                <h3 className="text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100">
                  {activeLocation.name}
                </h3>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 font-mono text-stone-600 dark:text-stone-300">
                3D Aerial
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-light">
              Explore {activeLocation.name} in high-resolution 3D topography with photorealistic building meshes, mountain relief, and street flyovers.
            </p>

            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
              <span className="font-semibold text-amber-950 dark:text-amber-300">Google Earth Spotlight: </span>
              <span className="text-stone-700 dark:text-stone-300">{activeLocation.highlight}</span>
            </div>

            {/* Action: Capture City into Itinerary */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleCaptureDestination(activeLocation)}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Capture City into Itinerary</span>
              </button>

              <a
                href={googleEarthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-xl transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>Fly in 3D</span>
              </a>
            </div>
          </div>

          {/* Global Cities Directory List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 px-1">
              Worldwide Locations ({filteredLocations.length} Countries & Cities)
            </div>

            <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
              {filteredLocations.length === 0 ? (
                /* Universal Earth Capture Card for any custom city/country */
                <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
                      Universal Geospatial Capture
                    </div>
                    <h4 className="text-base font-editorial font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                      "{searchQuery}"
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-sm mx-auto leading-relaxed">
                      Every country, city, mountain, and coast across Earth is accessible via Google Earth 3D and our bespoke itinerary engine.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                    <button
                      onClick={() => handleCaptureCustomQuery(searchQuery)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Capture & Build Itinerary</span>
                    </button>
                    <a
                      href={buildGoogleEarthSearchUrl(searchQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-xl transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-500" />
                      <span>Fly in Earth 3D</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  {searchQuery.trim() && (
                    <div className="p-2.5 rounded-xl bg-stone-100/90 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs flex items-center justify-between">
                      <span className="text-stone-600 dark:text-stone-300 text-[11px]">
                        Need custom coordinates for <strong>"{searchQuery}"</strong>?
                      </span>
                      <button
                        onClick={() => handleCaptureCustomQuery(searchQuery)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 bg-amber-200 dark:bg-amber-900 rounded-md hover:opacity-90"
                      >
                        Capture Custom
                      </button>
                    </div>
                  )}
                  {filteredLocations.map((loc) => {
                    const isSelected = loc.id === activeLocation.id;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => {
                          setActiveLocation(loc);
                          setTilt(loc.tilt);
                          setAltitude(loc.altitude);
                        }}
                        className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-2xs'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {loc.name}, {loc.country}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{loc.highlight}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCaptureDestination(loc);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950 rounded hover:bg-amber-200 transition-colors"
                            title="Generate itinerary for this city"
                          >
                            Capture
                          </button>

                          <a
                            href={buildGoogleEarthUrl(loc.lat, loc.lng, loc.altitude, loc.tilt)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                            title="Open in Google Earth"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
