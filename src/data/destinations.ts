import { Destination } from '../types/travel';

export const GLOBAL_DESTINATIONS: Destination[] = [
  {
    id: 'tokyo',
    country: 'Japan',
    city: 'Tokyo',
    region: 'Kanto',
    continent: 'Asia',
    currency: 'Japanese Yen',
    currencySymbol: '¥',
    language: 'Japanese',
    timeZone: 'Asia/Tokyo',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Temperate with distinct four seasons; pleasant spring cherry blossoms and crisp golden autumns.',
    bestSeason: 'March - May & October - December',
    culturalEtiquette: [
      'Tipping is strictly not customary and considered impolite.',
      'Remove shoes when entering ryokans, tea rooms, and tatami dining spaces.',
      'Maintain hushed voices on public transit; eating while walking is frowned upon.'
    ],
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    id: 'kyoto',
    country: 'Japan',
    city: 'Kyoto',
    region: 'Kansai',
    continent: 'Asia',
    currency: 'Japanese Yen',
    currencySymbol: '¥',
    language: 'Japanese',
    timeZone: 'Asia/Tokyo',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Valley microclimate; misty mornings and serene seasonal temple gardens.',
    bestSeason: 'April - May & November',
    culturalEtiquette: [
      'Do not photograph geishas or maikos in Gion without explicit permission.',
      'Bow slightly when greeting shopkeepers or temple attendants.',
      'Respect silence in Zen moss gardens and meditation halls.'
    ],
    coordinates: { lat: 35.0116, lng: 135.7681 }
  },
  {
    id: 'osaka',
    country: 'Japan',
    city: 'Osaka',
    region: 'Kansai',
    continent: 'Asia',
    currency: 'Japanese Yen',
    currencySymbol: '¥',
    language: 'Japanese',
    timeZone: 'Asia/Tokyo',
    heroImage: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Warm maritime climate; vibrant open-air canal atmosphere.',
    bestSeason: 'Spring & Autumn',
    culturalEtiquette: [
      'Known as the culinary kitchen of the nation: kuidaore (eat till you drop).',
      'Stand on the right side of escalators (unlike Tokyo which stands on the left).'
    ],
    coordinates: { lat: 34.6937, lng: 135.5023 }
  },
  {
    id: 'paris',
    country: 'France',
    city: 'Paris',
    region: 'Île-de-France',
    continent: 'Europe',
    currency: 'Euro',
    currencySymbol: '€',
    language: 'French',
    timeZone: 'Europe/Paris',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Mild oceanic climate with romantic afternoon overcast and golden terrace sunsets.',
    bestSeason: 'May - June & September - October',
    culturalEtiquette: [
      'Always greet staff with "Bonjour Madame / Monsieur" upon crossing any doorway.',
      'Service is included by law (service compris), but 5-10% rounded up is appreciated for exceptional care.',
      'Do not rush meals; dining is an artistic pause.'
    ],
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: 'nice',
    country: 'France',
    city: 'Nice & Côte d’Azur',
    region: 'Provence-Alpes-Côte d’Azur',
    continent: 'Europe',
    currency: 'Euro',
    currencySymbol: '€',
    language: 'French',
    timeZone: 'Europe/Paris',
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Mediterranean sunshine over 300 days a year; soothing sea breezes.',
    bestSeason: 'May - October',
    culturalEtiquette: [
      'Respect the afternoon lull (fermeture) in artisan ateliers.',
      'Try socca hot off the copper plate in Cours Saleya market.'
    ],
    coordinates: { lat: 43.7102, lng: 7.2620 }
  },
  {
    id: 'rome',
    country: 'Italy',
    city: 'Rome',
    region: 'Lazio',
    continent: 'Europe',
    currency: 'Euro',
    currencySymbol: '€',
    language: 'Italian',
    timeZone: 'Europe/Rome',
    heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Warm Mediterranean sun; balmy evening strolls (passeggiata).',
    bestSeason: 'April - June & September - November',
    culturalEtiquette: [
      'Cappuccino is strictly for mornings before 11:00 AM; order espresso afterwards.',
      'Modest attire covering shoulders and knees is mandatory in basilicas.',
      'Coperto (cover charge) is standard on dining receipts.'
    ],
    coordinates: { lat: 41.9028, lng: 12.4964 }
  },
  {
    id: 'florence',
    country: 'Italy',
    city: 'Florence',
    region: 'Tuscany',
    continent: 'Europe',
    currency: 'Euro',
    currencySymbol: '€',
    language: 'Italian',
    timeZone: 'Europe/Rome',
    heroImage: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Tuscan hills breeze; gentle morning mist over the Arno River.',
    bestSeason: 'May & September - October',
    culturalEtiquette: [
      'Never request well-done for Bistecca alla Fiorentina; it is prepared rare with Tuscan olive oil.',
      'Validate train tickets at platform stamp machines before boarding.'
    ],
    coordinates: { lat: 43.7696, lng: 11.2558 }
  },
  {
    id: 'bangkok',
    country: 'Thailand',
    city: 'Bangkok',
    region: 'Central Thailand',
    continent: 'Asia',
    currency: 'Thai Baht',
    currencySymbol: '฿',
    language: 'Thai',
    timeZone: 'Asia/Bangkok',
    heroImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Tropical warmth with vibrant evening canal breezes.',
    bestSeason: 'November - February',
    culturalEtiquette: [
      'Perform the wai (palms pressed together with a slight bow) when greeting elders or monks.',
      'Never point feet towards Buddha images or persons.',
      'Show deep reverence for the Thai Royal Family.'
    ],
    coordinates: { lat: 13.7563, lng: 100.5018 }
  },
  {
    id: 'bali',
    country: 'Indonesia',
    city: 'Bali (Ubud & Seminyak)',
    region: 'Lesser Sunda Islands',
    continent: 'Asia',
    currency: 'Indonesian Rupiah',
    currencySymbol: 'Rp',
    language: 'Indonesian / Balinese',
    timeZone: 'Asia/Makassar',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Tropical monsoon; lush emerald terraced rice fields and coastal surf.',
    bestSeason: 'April - October (Dry season)',
    culturalEtiquette: [
      'Wear a sarong and sash when entering holy temples (pura).',
      'Step around, never over, daily floral canang sari offerings on sidewalks.',
      'Use the right hand when offering or receiving items.'
    ],
    coordinates: { lat: -8.4095, lng: 115.1889 }
  },
  {
    id: 'london',
    country: 'United Kingdom',
    city: 'London',
    region: 'Greater London',
    continent: 'Europe',
    currency: 'British Pound',
    currencySymbol: '£',
    language: 'English',
    timeZone: 'Europe/London',
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Temperate maritime; charming misty evenings and bright garden summers.',
    bestSeason: 'May - September',
    culturalEtiquette: [
      'Stand on the right on the Tube escalators without fail.',
      'Queuing is sacred; wait your turn gracefully in pubs and bakeries.',
      'A discretionary 12.5% service charge is usually added to restaurant bills.'
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    id: 'barcelona',
    country: 'Spain',
    city: 'Barcelona',
    region: 'Catalonia',
    continent: 'Europe',
    currency: 'Euro',
    currencySymbol: '€',
    language: 'Spanish / Catalan',
    timeZone: 'Europe/Madrid',
    heroImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Mediterranean coastal warmth; long golden daylight hours.',
    bestSeason: 'May - June & September - October',
    culturalEtiquette: [
      'Lunch is served late (14:00 - 16:00); dinner rarely starts before 21:00.',
      'Tapas are meant to be shared in lively standing rounds at the counter.'
    ],
    coordinates: { lat: 41.3879, lng: 2.1699 }
  },
  {
    id: 'newyork',
    country: 'United States',
    city: 'New York',
    region: 'New York State',
    continent: 'Americas',
    currency: 'US Dollar',
    currencySymbol: '$',
    language: 'English',
    timeZone: 'America/New_York',
    heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Four distinct seasons; high energy brisk autumns and sparkling festive winters.',
    bestSeason: 'September - November & April - June',
    culturalEtiquette: [
      'Tipping 20% in sit-down restaurants and for yellow cabs is customary.',
      'Walk briskly and keep to the right on crowded sidewalks.'
    ],
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 'dubai',
    country: 'UAE',
    city: 'Dubai',
    region: 'Emirate of Dubai',
    continent: 'Middle East',
    currency: 'UAE Dirham',
    currencySymbol: 'AED',
    language: 'Arabic / English',
    timeZone: 'Asia/Dubai',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Desert luxury climate with balmy coastal winter evenings.',
    bestSeason: 'November - March',
    culturalEtiquette: [
      'Dress modestly in government buildings and cultural heritage districts.',
      'Public displays of overt affection are restrained.',
      'Hospitality begins with cardamom Arabic coffee (gahwa) and Bateel dates.'
    ],
    coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  {
    id: 'marrakech',
    country: 'Morocco',
    city: 'Marrakech',
    region: 'Marrakech-Safi',
    continent: 'Africa',
    currency: 'Moroccan Dirham',
    currencySymbol: 'MAD',
    language: 'Arabic / French',
    timeZone: 'Africa/Casablanca',
    heroImage: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Warm semi-arid climate with aromatic orange blossom courtyards.',
    bestSeason: 'October - April',
    culturalEtiquette: [
      'Accept mint tea with gratitude; it is poured gracefully from a height.',
      'Polite bargaining is an art form in the souks; smile and converse warmly.',
      'Ask permission before photographing street artisans in the medina.'
    ],
    coordinates: { lat: 31.6295, lng: -7.9811 }
  },
  {
    id: 'sydney',
    country: 'Australia',
    city: 'Sydney',
    region: 'New South Wales',
    continent: 'Oceania',
    currency: 'Australian Dollar',
    currencySymbol: 'A$',
    language: 'English',
    timeZone: 'Australia/Sydney',
    heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Sunny temperate climate; glorious harbor breezes and Pacific surf.',
    bestSeason: 'September - November & March - May',
    culturalEtiquette: [
      'Relaxed egalitarian culture; service staff prefer friendly, informal banter.',
      'Swim strictly between the red and yellow flags on beaches.'
    ],
    coordinates: { lat: -33.8688, lng: 151.2093 }
  },
  {
    id: 'santorini',
    country: 'Greece',
    city: 'Santorini',
    region: 'Cyclades',
    continent: 'Europe',
    currency: 'Euro',
    currencySymbol: '€',
    language: 'Greek / English',
    timeZone: 'Europe/Athens',
    heroImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Sun-drenched Aegean caldera breezes and dramatic golden sunsets.',
    bestSeason: 'April - October',
    culturalEtiquette: [
      'Do not climb atop the white church roofs or private cave dwelling walls for photos.',
      'Enjoy unhurried multi-course meals overlooking the caldera.'
    ],
    coordinates: { lat: 36.3932, lng: 25.4615 }
  },
  {
    id: 'athens',
    country: 'Greece',
    city: 'Athens',
    region: 'Attica',
    continent: 'Europe',
    currency: 'Euro',
    currencySymbol: '€',
    language: 'Greek',
    timeZone: 'Europe/Athens',
    heroImage: 'https://images.unsplash.com/photo-1555993539-1732916b8235?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Warm Mediterranean sun over ancient marble temples and vibrant Plaka alleys.',
    bestSeason: 'Spring & Autumn',
    culturalEtiquette: [
      'Greet shopkeepers with "Kalimera" in the morning.',
      'Coffee drinking is a relaxed social ritual; order freddo espresso.'
    ],
    coordinates: { lat: 37.9838, lng: 23.7275 }
  },
  {
    id: 'reykjavik',
    country: 'Iceland',
    city: 'Reykjavik',
    region: 'Capital Region',
    continent: 'Europe',
    currency: 'Icelandic Króna',
    currencySymbol: 'kr',
    language: 'Icelandic / English',
    timeZone: 'Atlantic/Reykjavik',
    heroImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Subpolar oceanic with dancing Aurora Borealis in winter and midnight sun in summer.',
    bestSeason: 'September - March (Aurora) & June - August (Midnight Sun)',
    culturalEtiquette: [
      'Shower thoroughly before entering geothermal mineral lagoons.',
      'Tap water is among the purest in the world; never buy bottled water.'
    ],
    coordinates: { lat: 64.1466, lng: -21.9426 }
  },
  {
    id: 'petra',
    country: 'Jordan',
    city: 'Petra (Wadi Musa)',
    region: 'Ma\'an Governorate',
    continent: 'Middle East',
    currency: 'Jordanian Dinar',
    currencySymbol: 'JOD',
    language: 'Arabic / English',
    timeZone: 'Asia/Amman',
    heroImage: 'https://images.unsplash.com/photo-1579606032834-d138d6b9d62d?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Arid desert canyon climate with crisp starry nights.',
    bestSeason: 'March - May & September - November',
    culturalEtiquette: [
      'Accept Bedouin sage tea poured with warm hospitality.',
      'Dress respectfully covering shoulders and knees in historic villages.'
    ],
    coordinates: { lat: 30.3285, lng: 35.4444 }
  },
  {
    id: 'cairo',
    country: 'Egypt',
    city: 'Cairo & Giza',
    region: 'Cairo Governorate',
    continent: 'Africa',
    currency: 'Egyptian Pound',
    currencySymbol: 'E£',
    language: 'Arabic',
    timeZone: 'Africa/Cairo',
    heroImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Desert sunshine alongside the lush historic Nile riverbank.',
    bestSeason: 'October - April',
    culturalEtiquette: [
      'Modest dress is appreciated in sacred mosques and Khan el-Khalili market.',
      'Small baksheesh (gratuity) is customary for personalized assistance.'
    ],
    coordinates: { lat: 29.9792, lng: 31.1342 }
  },
  {
    id: 'capetown',
    country: 'South Africa',
    city: 'Cape Town',
    region: 'Western Cape',
    continent: 'Africa',
    currency: 'South African Rand',
    currencySymbol: 'R',
    language: 'English / Afrikaans / Xhosa',
    timeZone: 'Africa/Johannesburg',
    heroImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Mediterranean coastal climate dominated by the dramatic flat-topped Table Mountain.',
    bestSeason: 'November - March',
    culturalEtiquette: [
      'Tip 10-15% for attentive dining and winery service.',
      'Enjoy relaxed conversational braai culture with local Pinotage wine.'
    ],
    coordinates: { lat: -33.9249, lng: 18.4241 }
  },
  {
    id: 'nairobi',
    country: 'Kenya',
    city: 'Nairobi',
    region: 'Nairobi County',
    continent: 'Africa',
    currency: 'Kenyan Shilling',
    currencySymbol: 'KSh',
    language: 'Swahili / English',
    timeZone: 'Africa/Nairobi',
    heroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Pleasant high-altitude subtropical climate; safari gateway.',
    bestSeason: 'July - October (Great Migration)',
    culturalEtiquette: [
      'Greet with "Jambo" or a warm handshake.',
      'Show deep reverence for wildlife and conservation park guidelines.'
    ],
    coordinates: { lat: -1.2921, lng: 36.8219 }
  },
  {
    id: 'cusco',
    country: 'Peru',
    city: 'Cusco & Machu Picchu',
    region: 'Andes Highlands',
    continent: 'Americas',
    currency: 'Peruvian Sol',
    currencySymbol: 'S/',
    language: 'Spanish / Quechua',
    timeZone: 'America/Lima',
    heroImage: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'High Andean mountain air; cool sunny dry season and misty citadel mornings.',
    bestSeason: 'May - October',
    culturalEtiquette: [
      'Sip mate de coca upon arrival to acclimatize to high altitude.',
      'Treat sacred Incan stone masonry and Apus (mountain spirits) with reverence.'
    ],
    coordinates: { lat: -13.1631, lng: -72.5450 }
  },
  {
    id: 'rio',
    country: 'Brazil',
    city: 'Rio de Janeiro',
    region: 'Southeast',
    continent: 'Americas',
    currency: 'Brazilian Real',
    currencySymbol: 'R$',
    language: 'Portuguese',
    timeZone: 'America/Sao_Paulo',
    heroImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Tropical vibrancy with sweeping beaches, lush Atlantic rainforest, and iconic peaks.',
    bestSeason: 'December - March (Festive) & May - September (Milder)',
    culturalEtiquette: [
      'Dress casually and chicly for beach promenade botecos.',
      'Greet with friendly warmth and double cheek kisses.'
    ],
    coordinates: { lat: -22.9068, lng: -43.1729 }
  },
  {
    id: 'oaxaca',
    country: 'Mexico',
    city: 'Oaxaca & Mexico City',
    region: 'Central Highlands',
    continent: 'Americas',
    currency: 'Mexican Peso',
    currencySymbol: '$',
    language: 'Spanish',
    timeZone: 'America/Mexico_City',
    heroImage: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Year-round temperate highland sunshine with rich indigenous culinary traditions.',
    bestSeason: 'October - April',
    culturalEtiquette: [
      'Sip artisanal mezcal slowly ("kissing" the spirit with orange slices and sal de gusano).',
      'Tipping 10-15% (la propina) is customary in restaurants.'
    ],
    coordinates: { lat: 17.0732, lng: -96.7266 }
  },
  {
    id: 'seoul',
    country: 'South Korea',
    city: 'Seoul',
    region: 'Seoul Capital Area',
    continent: 'Asia',
    currency: 'South Korean Won',
    currencySymbol: '₩',
    language: 'Korean',
    timeZone: 'Asia/Seoul',
    heroImage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Dynamic four seasons; blooming cherry springs and crisp maple autumns.',
    bestSeason: 'September - November & April - May',
    culturalEtiquette: [
      'Use both hands when pouring or receiving drinks from hosts.',
      'Slight bow upon greeting; shoes off in traditional hanok floors.'
    ],
    coordinates: { lat: 37.5665, lng: 126.9780 }
  },
  {
    id: 'singapore',
    country: 'Singapore',
    city: 'Singapore',
    region: 'Southeast Asia',
    continent: 'Asia',
    currency: 'Singapore Dollar',
    currencySymbol: 'S$',
    language: 'English / Mandarin / Malay / Tamil',
    timeZone: 'Asia/Singapore',
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Lush tropical climate with state-of-the-art biophilic architecture and garden canopies.',
    bestSeason: 'Year-round',
    culturalEtiquette: [
      'Choping tables at hawker centres with tissue packets is a recognized local tradition.',
      'Strict cleanliness laws; littering is penalized.'
    ],
    coordinates: { lat: 1.3521, lng: 103.8198 }
  },
  {
    id: 'vienna',
    country: 'Austria',
    city: 'Vienna',
    region: 'Vienna Basin',
    continent: 'Europe',
    currency: 'Euro',
    currencySymbol: '€',
    language: 'German',
    timeZone: 'Europe/Vienna',
    heroImage: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Continental elegance; imperial palaces and historic marble coffee houses.',
    bestSeason: 'May - September & December (Festive Markets)',
    culturalEtiquette: [
      'In traditional Kaffeehäuser, take your time unhurriedly reading newspapers.',
      'Round up the bill 5-10% (Trinkgeld) directly to the waiter.'
    ],
    coordinates: { lat: 48.2082, lng: 16.3738 }
  },
  {
    id: 'lisbon',
    country: 'Portugal',
    city: 'Lisbon & Porto',
    region: 'Iberian Peninsula',
    continent: 'Europe',
    currency: 'Euro',
    currencySymbol: '€',
    language: 'Portuguese',
    timeZone: 'Europe/Lisbon',
    heroImage: 'https://images.unsplash.com/photo-1513688285373-4ec92273f679?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Luminous Atlantic sunlight, azulejo tile facades, and gentle Tagus river breezes.',
    bestSeason: 'April - June & September - October',
    culturalEtiquette: [
      'Listen respectfully to fado in Alfama taverns during performances.',
      'Pastéis de nata are best warm with a dust of cinnamon.'
    ],
    coordinates: { lat: 38.7223, lng: -9.1393 }
  },
  {
    id: 'queenstown',
    country: 'New Zealand',
    city: 'Queenstown',
    region: 'Otago',
    continent: 'Oceania',
    currency: 'New Zealand Dollar',
    currencySymbol: 'NZ$',
    language: 'English / Māori',
    timeZone: 'Pacific/Auckland',
    heroImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
    climateNotes: 'Majestic Southern Alps towering over pristine crystal-clear Lake Wakatipu.',
    bestSeason: 'December - February (Summer Alpine) & June - August (Snow Skiing)',
    culturalEtiquette: [
      'Tipping is not expected in New Zealand, though appreciated for outstanding dining.',
      'Respect the Māori guardianship of nature: Kaitiakitanga.'
    ],
    coordinates: { lat: -45.0312, lng: 168.6626 }
  }
];

/**
 * Universal helper to build a valid Destination object for ANY city/country in the world
 */
export function createCustomDestination(
  cityName: string,
  countryName: string,
  continent: Destination['continent'] = 'Europe',
  coords?: { lat: number; lng: number }
): Destination {
  const cleanCity = cityName.trim() || 'Global City';
  const cleanCountry = countryName.trim() || 'World Destination';
  const id = `${cleanCity.toLowerCase().replace(/[^a-z0-9]/g, '')}-${cleanCountry.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return {
    id: id || 'custom-destination',
    city: cleanCity,
    country: cleanCountry,
    region: continent,
    continent,
    currency: 'Local Currency',
    currencySymbol: '$',
    language: 'Local Language',
    timeZone: 'UTC',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    climateNotes: `Pleasant seasonal conditions suited for exploring ${cleanCity}.`,
    bestSeason: 'Spring & Autumn',
    culturalEtiquette: [
      `Embrace the warm hospitality and heritage of ${cleanCountry}.`,
      'Respect local cultural customs and sacred sites.'
    ],
    coordinates: coords || { lat: 45.0, lng: 10.0 }
  };
}

export const PROFILE_PRESETS = [
  {
    id: 'culinary_epicurean',
    title: 'The Haute Epicurean',
    subtitle: 'Michelin counters, bustling street markets & hidden speakeasies',
    profile: {
      name: 'Julian & Claire',
      pace: 'balanced' as const,
      companion: 'couple' as const,
      passions: ['Michelin & Fine Dining', 'Night Markets & Street Food', 'Secret Speakeasies', 'Artisan Craft'],
      dietary: ['Adventurous Omnivore', 'Fine Wine Pairing'],
      tier: 'luxury' as const,
      mobility: 'walking' as const,
      notes: 'Lover of counter-dining, raw seafood, and vintage cocktail craftsmanship.'
    }
  },
  {
    id: 'culture_artisan',
    title: 'The Cultural Connoisseur',
    subtitle: 'Quiet temple gardens, heritage ateliers & serene tea houses',
    profile: {
      name: 'Elena Rostova',
      pace: 'relaxed' as const,
      companion: 'solo' as const,
      passions: ['Ancient Temples & History', 'Modern Architecture', 'Artisan Craft', 'Scenic Photography'],
      dietary: ['Vegetarian Friendly', 'Matcha & Herbal'],
      tier: 'boutique' as const,
      mobility: 'walking' as const,
      notes: 'Prefers morning light for architectural photography and unhurried meditation.'
    }
  },
  {
    id: 'high_roller_luxe',
    title: 'The Grand Ambassador',
    subtitle: 'Private chauffeur, penthouse views, chef tasting menus & VIP access',
    profile: {
      name: 'Marcus & Sophia Vance',
      pace: 'balanced' as const,
      companion: 'couple' as const,
      passions: ['Michelin & Fine Dining', 'Modern Architecture', 'Wellness & Thermal Spas', 'Secret Speakeasies'],
      dietary: ['Champagne & Caviar', 'Gluten-Conscious'],
      tier: 'ultra_luxe' as const,
      mobility: 'chauffeur' as const,
      notes: 'Expects table priority, quiet panoramic corners, and bespoke sommelier selections.'
    }
  },
  {
    id: 'family_explorers',
    title: 'The Heritage Family',
    subtitle: 'Engaging discoveries, lively food halls & spacious scenic walks',
    profile: {
      name: 'The Sterling Family',
      pace: 'relaxed' as const,
      companion: 'family' as const,
      passions: ['Night Markets & Street Food', 'Ancient Temples & History', 'Artisan Craft'],
      dietary: ['Kid-Friendly Options', 'Nut-Free Safety'],
      tier: 'luxury' as const,
      mobility: 'walking' as const,
      notes: 'Traveling with children aged 8 & 12. Need gentle pacing with midday refreshment pauses.'
    }
  }
];
