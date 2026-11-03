import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkDiningMix,
  calculateDayStats,
  buildGoogleMapsRouteUrl,
  generateSyncCode,
  serializeItineraryForOffline,
  deserializeOfflineItinerary,
  mapWeatherCodeToCondition,
  adjustActivityPacing,
} from './rules.ts';
import { ActivityItem, GuestProfile, Itinerary, ItineraryDay } from '../types/travel.ts';

const mockActivityDining1: ActivityItem = {
  id: 'd1',
  title: 'Tsukiji Outer Market Tasting',
  category: 'market',
  diningType: 'local_market',
  time: '08:30 AM',
  durationMinutes: 90,
  description: 'Fresh sea urchin and tamagoyaki',
  insiderTip: 'Visit stall #4 for warm dashi egg',
  locationName: 'Tsukiji Outer Market',
  neighborhood: 'Chuo',
  coordinates: { lat: 35.6654, lng: 139.7707 },
  bookingPlatform: 'Direct',
  bookingLink: 'https://tsukiji.or.jp',
  priceEstimate: '$',
};

const mockActivityDining2: ActivityItem = {
  id: 'd2',
  title: 'Omoide Yokocho Yakitori',
  category: 'dining',
  diningType: 'street_food',
  time: '12:30 PM',
  durationMinutes: 60,
  description: 'Smoky charcoal chicken skewers in narrow lantern-lit alley',
  insiderTip: 'Order the negima with tare sauce',
  locationName: 'Omoide Yokocho',
  neighborhood: 'Shinjuku',
  coordinates: { lat: 35.6938, lng: 139.6994 },
  bookingPlatform: 'Direct',
  bookingLink: 'https://maps.google.com',
  priceEstimate: '$',
};

const mockActivityDining3: ActivityItem = {
  id: 'd3',
  title: 'Florilège Haute French-Japanese',
  category: 'dining',
  diningType: 'upscale_restaurant',
  time: '07:30 PM',
  durationMinutes: 120,
  description: 'Two-Michelin star theatrical counter experience',
  insiderTip: 'Request center seating overlooking chef Hiroyasu Kawate',
  locationName: 'Florilège',
  neighborhood: 'Toranomon',
  coordinates: { lat: 35.6672, lng: 139.7483 },
  bookingPlatform: 'TableCheck',
  bookingLink: 'https://tablecheck.com',
  priceEstimate: '$$$$',
};

const mockActivityCulture: ActivityItem = {
  id: 'c1',
  title: 'Meiji Jingu Sacred Forest Walk',
  category: 'culture',
  time: '10:30 AM',
  durationMinutes: 75,
  description: 'Centuries-old cypress torii gate and serene camphor woods',
  insiderTip: 'Bow once before crossing the inner shrine gate',
  locationName: 'Meiji Jingu',
  neighborhood: 'Shibuya',
  coordinates: { lat: 35.6764, lng: 139.6993 },
  bookingPlatform: 'Direct',
  bookingLink: 'https://meijijingu.or.jp',
  priceEstimate: '$',
};

test('checkDiningMix detects street/market and upscale variety', () => {
  const items = [mockActivityDining1, mockActivityDining3];
  const result = checkDiningMix(items);
  assert.equal(result.hasStreetOrMarket, true);
  assert.equal(result.hasUpscale, true);
  assert.equal(result.isBalanced, true);
  assert.equal(result.categoriesFound.length, 2);
});

test('calculateDayStats computes counts and walking time accurately', () => {
  const day: ItineraryDay = {
    dayNumber: 1,
    theme: 'Epicurean Contrasts',
    summary: 'From fish market dawn to two-star counter dusk',
    items: [mockActivityDining1, mockActivityCulture, mockActivityDining2, mockActivityDining3],
  };

  const stats = calculateDayStats(day);
  assert.equal(stats.totalActivities, 4);
  assert.equal(stats.diningCount, 3);
  assert.equal(stats.cultureCount, 1);
  assert.equal(stats.totalDurationMinutes, 90 + 75 + 60 + 120);
  assert.equal(stats.estimatedWalkingMinutes, (4 - 1) * 15);
});

test('buildGoogleMapsRouteUrl builds valid multi-stop directions url', () => {
  const items = [mockActivityDining1, mockActivityCulture, mockActivityDining3];
  const url = buildGoogleMapsRouteUrl(items);
  assert.ok(url.includes('google.com/maps/dir'));
  assert.ok(url.includes(encodeURIComponent('Tsukiji Outer Market')));
  assert.ok(url.includes(encodeURIComponent('Florilège')));
  assert.ok(url.includes('travelmode=walking'));
});

test('generateSyncCode generates 6-character clean code', () => {
  const code = generateSyncCode();
  assert.equal(code.length, 6);
  assert.match(code, /^[2-9A-Z]{6}$/);
});

test('serialize and deserialize offline itinerary preserves all fields', () => {
  const itinerary: Itinerary = {
    id: 'itin-tokyo-1',
    tripTitle: 'Tokyo Haute & Hidden Journey',
    destination: {
      id: 'tokyo',
      country: 'Japan',
      city: 'Tokyo',
      region: 'Kanto',
      continent: 'Asia',
      currency: 'Yen',
      currencySymbol: '¥',
      language: 'Japanese',
      timeZone: 'Asia/Tokyo',
      heroImage: 'test.jpg',
      climateNotes: 'Mild',
      bestSeason: 'Spring',
      culturalEtiquette: ['Bow softly'],
      coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    profile: {
      name: 'Julian Vance',
      pace: 'relaxed',
      companion: 'couple',
      passions: ['Michelin'],
      dietary: ['Adventurous'],
      tier: 'luxury',
      mobility: 'walking',
    },
    durationDays: 1,
    startDate: '2026-11-15',
    summary: 'A bespoke journey',
    conciergePreamble: 'Welcome',
    culturalEtiquette: ['Bow softly'],
    days: [
      {
        dayNumber: 1,
        theme: 'Dawn to Dusk',
        summary: 'Culinary perfection',
        items: [mockActivityDining1, mockActivityDining3],
      },
    ],
    createdAt: new Date().toISOString(),
    syncCode: 'ABCDEF',
  };

  const serialized = serializeItineraryForOffline(itinerary);
  const deserialized = deserializeOfflineItinerary(serialized);

  assert.ok(deserialized !== null);
  assert.equal(deserialized?.tripTitle, 'Tokyo Haute & Hidden Journey');
  assert.equal(deserialized?.destination.city, 'Tokyo');
  assert.equal(deserialized?.days.length, 1);
  assert.equal(deserialized?.days[0].items.length, 2);
});

test('mapWeatherCodeToCondition handles clear and rain conditions with concierge advice', () => {
  const clear = mapWeatherCodeToCondition(0);
  assert.equal(clear.isRainy, false);
  assert.ok(clear.label.includes('Azure'));

  const rain = mapWeatherCodeToCondition(61);
  assert.equal(rain.isRainy, true);
  assert.ok(rain.conciergeTip.includes('umbrella'));
});

test('adjustActivityPacing limits items for relaxed vs intensive guests', () => {
  const items = [
    mockActivityDining1,
    mockActivityCulture,
    mockActivityDining2,
    mockActivityDining3,
    mockActivityDining1,
    mockActivityCulture,
  ];

  const relaxedProfile: GuestProfile = {
    name: 'Test',
    pace: 'relaxed',
    companion: 'solo',
    passions: [],
    dietary: [],
    tier: 'boutique',
    mobility: 'walking',
  };

  const intensiveProfile: GuestProfile = {
    ...relaxedProfile,
    pace: 'intensive',
  };

  assert.equal(adjustActivityPacing(items, relaxedProfile).length, 4);
  assert.equal(adjustActivityPacing(items, intensiveProfile).length, 6);
});

test('generateCuratedItinerary produces valid days and balanced dining mix', async () => {
  const { GLOBAL_DESTINATIONS } = await import('../data/destinations.ts');
  const { generateCuratedItinerary } = await import('../data/curatedItineraries.ts');
  
  const tokyo = GLOBAL_DESTINATIONS[0];
  const profile: GuestProfile = {
    name: 'Julian Vance',
    pace: 'balanced',
    companion: 'couple',
    passions: ['Michelin & Fine Dining'],
    dietary: ['Adventurous Omnivore'],
    tier: 'luxury',
    mobility: 'walking',
  };

  const itinerary = generateCuratedItinerary(tokyo, profile, 3);
  assert.equal(itinerary.days.length, 3);
  assert.equal(itinerary.destination.city, 'Tokyo');
  
  // Verify Day 1 has dining mix (street food or local market + upscale or hidden gem)
  const diningMix = checkDiningMix(itinerary.days[0].items);
  assert.equal(diningMix.hasStreetOrMarket, true);
  assert.equal(diningMix.isBalanced, true);
});

test('buildGoogleEarthUrl formats 3D web url with altitude and tilt', async () => {
  const { buildGoogleEarthUrl, buildGoogleEarthSearchUrl } = await import('./rules.ts');
  const url = buildGoogleEarthUrl(35.6762, 139.6503, 750, 45, 180);
  assert.ok(url.startsWith('https://earth.google.com/web/@35.676200,139.650300'));
  assert.ok(url.includes('750a'));
  assert.ok(url.includes('45t'));

  const searchUrl = buildGoogleEarthSearchUrl('Eiffel Tower, Paris');
  assert.equal(searchUrl, 'https://earth.google.com/web/search/Eiffel%20Tower%2C%20Paris');
});

test('createCustomDestination creates valid destination and generates complete itinerary for any global city', async () => {
  const { createCustomDestination } = await import('../data/destinations.ts');
  const { generateCuratedItinerary } = await import('../data/curatedItineraries.ts');

  // Test an arbitrary city anywhere on Earth
  const customDest = createCustomDestination('Reykjavik', 'Iceland', 'Europe', { lat: 64.1466, lng: -21.9426 });
  assert.equal(customDest.city, 'Reykjavik');
  assert.equal(customDest.country, 'Iceland');
  assert.equal(customDest.coordinates.lat, 64.1466);

  const profile: GuestProfile = {
    name: 'Explorer Guest',
    pace: 'balanced',
    companion: 'solo',
    passions: ['Artisan Craft'],
    dietary: ['Adventurous Omnivore'],
    tier: 'boutique',
    mobility: 'walking',
  };

  const itinerary = generateCuratedItinerary(customDest, profile, 4);
  assert.equal(itinerary.days.length, 4);
  assert.equal(itinerary.destination.city, 'Reykjavik');
  assert.ok(itinerary.tripTitle.includes('Reykjavik'));
  
  // Verify dining mix on custom generated day
  const mix = checkDiningMix(itinerary.days[0].items);
  assert.equal(mix.hasStreetOrMarket, true);
  assert.equal(mix.hasUpscale, true);
  assert.equal(mix.isBalanced, true);
});



