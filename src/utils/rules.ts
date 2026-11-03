import { ActivityItem, DiningCategory, GuestProfile, Itinerary, ItineraryDay } from '../types/travel';

/**
 * Validates that an itinerary or day provides a balanced dining mix
 * across street food/market, hidden local gems, and upscale establishments.
 */
export function checkDiningMix(items: ActivityItem[]): {
  hasStreetOrMarket: boolean;
  hasHiddenGem: boolean;
  hasUpscale: boolean;
  isBalanced: boolean;
  categoriesFound: DiningCategory[];
} {
  const categoriesFound: DiningCategory[] = [];

  for (const item of items) {
    if (item.category === 'dining' || item.category === 'market') {
      if (item.diningType && !categoriesFound.includes(item.diningType)) {
        categoriesFound.push(item.diningType);
      }
    }
  }

  const hasStreetOrMarket = categoriesFound.includes('street_food') || categoriesFound.includes('local_market');
  const hasHiddenGem = categoriesFound.includes('hidden_gem');
  const hasUpscale = categoriesFound.includes('upscale_restaurant');

  return {
    hasStreetOrMarket,
    hasHiddenGem,
    hasUpscale,
    isBalanced: hasStreetOrMarket && (hasHiddenGem || hasUpscale),
    categoriesFound,
  };
}

/**
 * Calculates aggregate statistics for an itinerary day
 */
export function calculateDayStats(day: ItineraryDay): {
  totalActivities: number;
  diningCount: number;
  cultureCount: number;
  estimatedWalkingMinutes: number;
  totalDurationMinutes: number;
} {
  let diningCount = 0;
  let cultureCount = 0;
  let totalDurationMinutes = 0;

  for (const item of day.items) {
    totalDurationMinutes += item.durationMinutes || 60;
    if (item.category === 'dining' || item.category === 'market') {
      diningCount++;
    } else if (item.category === 'culture' || item.category === 'sight') {
      cultureCount++;
    }
  }

  // Estimate walking transition time between stops (average 15-20 min between sequential stops)
  const transitions = Math.max(0, day.items.length - 1);
  const estimatedWalkingMinutes = transitions * 15;

  return {
    totalActivities: day.items.length,
    diningCount,
    cultureCount,
    estimatedWalkingMinutes,
    totalDurationMinutes,
  };
}

/**
 * Builds a Google Maps direction URL for turn-by-turn navigation of the day's stops
 */
export function buildGoogleMapsRouteUrl(items: ActivityItem[]): string {
  if (!items || items.length === 0) return 'https://www.google.com/maps';
  if (items.length === 1) {
    const item = items[0];
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.locationName)}`;
  }

  const origin = encodeURIComponent(items[0].locationName);
  const destination = encodeURIComponent(items[items.length - 1].locationName);

  if (items.length === 2) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
  }

  // Up to 9 waypoints in Google Maps direction URL
  const waypoints = items
    .slice(1, -1)
    .slice(0, 8)
    .map((item) => encodeURIComponent(item.locationName))
    .join('|');

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=walking`;
}

/**
 * Builds a direct Google Maps navigation URL for a single location
 */
export function buildSingleLocationMapUrl(locationName: string, city: string, coords?: { lat: number; lng: number }): string {
  if (coords && coords.lat && coords.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&destination_place_id=${encodeURIComponent(locationName + ', ' + city)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName + ', ' + city)}`;
}

/**
 * Builds an authentic 3D Google Earth URL with coordinates, altitude, pitch, tilt, and heading
 */
export function buildGoogleEarthUrl(
  lat: number,
  lng: number,
  altitude: number = 800,
  tilt: number = 60,
  heading: number = 0
): string {
  // Format: https://earth.google.com/web/@lat,lng,altitudeA,distanceD,35y,headingH,tiltT,0r
  const latStr = lat.toFixed(6);
  const lngStr = lng.toFixed(6);
  return `https://earth.google.com/web/@${latStr},${lngStr},${altitude}a,1000d,35y,${heading}h,${tilt}t,0r`;
}

/**
 * Builds a Google Earth search URL to capture any country, city, or landmark worldwide
 */
export function buildGoogleEarthSearchUrl(query: string): string {
  return `https://earth.google.com/web/search/${encodeURIComponent(query)}`;
}

/**
 * Generates an elegant 6-character alphanumeric sync code for cross-device pairing
 */
export function generateSyncCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Serializes itinerary for offline storage and QR synchronization
 */
export function serializeItineraryForOffline(itinerary: Itinerary): string {
  return JSON.stringify(itinerary);
}

/**
 * Deserializes offline JSON string with schema validation
 */
export function deserializeOfflineItinerary(jsonStr: string): Itinerary | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.tripTitle && parsed.destination && Array.isArray(parsed.days)) {
      return parsed as Itinerary;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Formats Open-Meteo weather codes into readable conditions and luxury tone
 */
export function mapWeatherCodeToCondition(code: number): {
  label: string;
  isRainy: boolean;
  conciergeTip: string;
} {
  switch (code) {
    case 0:
      return {
        label: 'Clear Azure Sky',
        isRainy: false,
        conciergeTip: 'Ideal morning for open-air temple strolls and terrace aperitifs.',
      };
    case 1:
    case 2:
      return {
        label: 'Soft Golden Clouds',
        isRainy: false,
        conciergeTip: 'Gentle diffused light, perfect for architectural exploration and photography.',
      };
    case 3:
      return {
        label: 'Overcast & Atmospheric',
        isRainy: false,
        conciergeTip: 'Comfortably shaded; wonderful for garden walks and tea salons.',
      };
    case 45:
    case 48:
      return {
        label: 'Misty Haze',
        isRainy: false,
        conciergeTip: 'Atmospheric morning mist; hot matcha or roasted espresso strongly recommended.',
      };
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return {
        label: 'Silken Rain Showers',
        isRainy: true,
        conciergeTip: 'Rain showers present; an umbrella will be arranged by your concierge. Back-alley covered arcades & museum visits prioritized.',
      };
    case 71:
    case 73:
    case 75:
      return {
        label: 'Winter Frost / Snow',
        isRainy: false,
        conciergeTip: 'Brisk snowfall; warm wool cashmere wrap and thermal baths recommended.',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        isRainy: true,
        conciergeTip: 'Indoor salon experiences, private galleries, and fireside dining advised.',
      };
    default:
      return {
        label: 'Pleasant & Mild',
        isRainy: false,
        conciergeTip: 'Splendid weather for wandering authentic neighborhood alleyways.',
      };
  }
}

/**
 * Filter and sort activity recommendations based on guest pace and companion type
 */
export function adjustActivityPacing(items: ActivityItem[], profile: GuestProfile): ActivityItem[] {
  if (profile.pace === 'relaxed') {
    // Keep max 4 key activities per day to avoid rushed feeling
    return items.slice(0, 4);
  }
  if (profile.pace === 'balanced') {
    return items.slice(0, 5);
  }
  // Intensive: keep up to 6 items
  return items.slice(0, 6);
}
