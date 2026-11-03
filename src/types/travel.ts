export type TravelPace = 'relaxed' | 'balanced' | 'intensive';
export type CompanionType = 'solo' | 'couple' | 'family' | 'friends' | 'business';
export type LuxuryTier = 'boutique' | 'luxury' | 'ultra_luxe' | 'authentic';
export type MobilityType = 'walking' | 'chauffeur' | 'accessible';

export type DiningCategory = 
  | 'street_food' 
  | 'local_market' 
  | 'hidden_gem' 
  | 'upscale_restaurant' 
  | 'artisan_cafe';

export type ActivityCategory = 
  | 'dining' 
  | 'culture' 
  | 'sight' 
  | 'market' 
  | 'hidden_gem' 
  | 'wellness' 
  | 'nightlife';

export type BookingPlatform = 
  | 'OpenTable' 
  | 'Resy' 
  | 'TableCheck' 
  | 'TheFork' 
  | 'GetYourGuide' 
  | 'Viator' 
  | 'Klook' 
  | 'Direct';

export interface GuestProfile {
  name: string;
  email?: string;
  pace: TravelPace;
  companion: CompanionType;
  passions: string[];
  dietary: string[];
  tier: LuxuryTier;
  mobility: MobilityType;
  notes?: string;
}

export interface Destination {
  id: string;
  country: string;
  city: string;
  region: string;
  continent: 'Asia' | 'Europe' | 'Americas' | 'Middle East' | 'Oceania' | 'Africa';
  currency: string;
  currencySymbol: string;
  language: string;
  timeZone: string;
  heroImage: string;
  climateNotes: string;
  bestSeason: string;
  culturalEtiquette: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ActivityItem {
  id: string;
  title: string;
  category: ActivityCategory;
  diningType?: DiningCategory;
  time: string;
  durationMinutes: number;
  description: string;
  insiderTip: string;
  locationName: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  bookingPlatform: BookingPlatform;
  bookingLink: string;
  reservationStatus?: 'unreserved' | 'requested' | 'confirmed';
  priceEstimate: '$' | '$$' | '$$$' | '$$$$';
  signatureDish?: string;
  dressCode?: string;
  distanceFromPrev?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  dateStr?: string;
  theme: string;
  summary: string;
  items: ActivityItem[];
  weatherAdvisory?: string;
}

export interface Itinerary {
  id: string;
  tripTitle: string;
  destination: Destination;
  profile: GuestProfile;
  durationDays: number;
  startDate: string;
  summary: string;
  conciergePreamble: string;
  culturalEtiquette: string[];
  days: ItineraryDay[];
  createdAt: string;
  syncCode: string;
  offlineReady?: boolean;
}

export interface WeatherData {
  city: string;
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    condition: string;
    windSpeed: number;
    weatherCode: number;
  };
  daily: Array<{
    day: string;
    tempMax: number;
    tempMin: number;
    precipProb: number;
    condition: string;
    weatherCode: number;
    uvIndex: number;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  locationContext?: string;
  groundingPlaces?: Array<{ title: string; uri?: string; address?: string }>;
}
