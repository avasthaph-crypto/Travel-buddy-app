import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '5mb' }));

// In-memory cross-device sync store (with 24hr TTL cleanup)
const syncStore = new Map<string, { data: unknown; updatedAt: number }>();

// Clean up expired sync entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of syncStore.entries()) {
    if (now - value.updatedAt > 24 * 60 * 60 * 1000) {
      syncStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

// Initialize Gemini client if valid API key is provided
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 15) {
  try {
    aiClient = new GoogleGenAI({});
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Coordinate lookup for cities for live weather integration
const CITY_COORDINATES: Record<string, { lat: number; lon: number; country: string; timezone: string }> = {
  tokyo: { lat: 35.6762, lon: 139.6503, country: 'Japan', timezone: 'Asia/Tokyo' },
  kyoto: { lat: 35.0116, lon: 135.7681, country: 'Japan', timezone: 'Asia/Tokyo' },
  osaka: { lat: 34.6937, lon: 135.5023, country: 'Japan', timezone: 'Asia/Tokyo' },
  paris: { lat: 48.8566, lon: 2.3522, country: 'France', timezone: 'Europe/Paris' },
  nice: { lat: 43.7102, lon: 7.2620, country: 'France', timezone: 'Europe/Paris' },
  lyon: { lat: 45.7640, lon: 4.8357, country: 'France', timezone: 'Europe/Paris' },
  rome: { lat: 41.9028, lon: 12.4964, country: 'Italy', timezone: 'Europe/Rome' },
  florence: { lat: 43.7696, lon: 11.2558, country: 'Italy', timezone: 'Europe/Rome' },
  amalfi: { lat: 40.6340, lon: 14.6027, country: 'Italy', timezone: 'Europe/Rome' },
  bali: { lat: -8.4095, lon: 115.1889, country: 'Indonesia', timezone: 'Asia/Makassar' },
  yogyakarta: { lat: -7.7956, lon: 110.3695, country: 'Indonesia', timezone: 'Asia/Jakarta' },
  bangkok: { lat: 13.7563, lon: 100.5018, country: 'Thailand', timezone: 'Asia/Bangkok' },
  chiangmai: { lat: 18.7883, lon: 98.9853, country: 'Thailand', timezone: 'Asia/Bangkok' },
  phuket: { lat: 7.8804, lon: 98.3923, country: 'Thailand', timezone: 'Asia/Bangkok' },
  london: { lat: 51.5074, lon: -0.1278, country: 'United Kingdom', timezone: 'Europe/London' },
  edinburgh: { lat: 55.9533, lon: -3.1883, country: 'United Kingdom', timezone: 'Europe/London' },
  barcelona: { lat: 41.3879, lon: 2.1699, country: 'Spain', timezone: 'Europe/Madrid' },
  seville: { lat: 37.3891, lon: -5.9845, country: 'Spain', timezone: 'Europe/Madrid' },
  madrid: { lat: 40.4168, lon: -3.7038, country: 'Spain', timezone: 'Europe/Madrid' },
  newyork: { lat: 40.7128, lon: -74.0060, country: 'United States', timezone: 'America/New_York' },
  sanfrancisco: { lat: 37.7749, lon: -122.4194, country: 'United States', timezone: 'America/Los_Angeles' },
  neworleans: { lat: 29.9511, lon: -90.0715, country: 'United States', timezone: 'America/Chicago' },
  dubai: { lat: 25.2048, lon: 55.2708, country: 'UAE', timezone: 'Asia/Dubai' },
  abudhabi: { lat: 24.4539, lon: 54.3773, country: 'UAE', timezone: 'Asia/Dubai' },
  zurich: { lat: 47.3769, lon: 8.5417, country: 'Switzerland', timezone: 'Europe/Zurich' },
  lucerne: { lat: 47.0502, lon: 8.3093, country: 'Switzerland', timezone: 'Europe/Zurich' },
  zermatt: { lat: 45.9765, lon: 7.7491, country: 'Switzerland', timezone: 'Europe/Zurich' },
  marrakech: { lat: 31.6295, lon: -7.9811, country: 'Morocco', timezone: 'Africa/Casablanca' },
  sydney: { lat: -33.8688, lon: 151.2093, country: 'Australia', timezone: 'Australia/Sydney' },
  melbourne: { lat: -37.8136, lon: 144.9631, country: 'Australia', timezone: 'Australia/Melbourne' },
  santorini: { lat: 36.3932, lon: 25.4615, country: 'Greece', timezone: 'Europe/Athens' },
  athens: { lat: 37.9838, lon: 23.7275, country: 'Greece', timezone: 'Europe/Athens' },
  reykjavik: { lat: 64.1466, lon: -21.9426, country: 'Iceland', timezone: 'Atlantic/Reykjavik' },
  petra: { lat: 30.3285, lon: 35.4444, country: 'Jordan', timezone: 'Asia/Amman' },
  cairo: { lat: 29.9792, lon: 31.1342, country: 'Egypt', timezone: 'Africa/Cairo' },
  capetown: { lat: -33.9249, lon: 18.4241, country: 'South Africa', timezone: 'Africa/Johannesburg' },
  nairobi: { lat: -1.2921, lon: 36.8219, country: 'Kenya', timezone: 'Africa/Nairobi' },
  cusco: { lat: -13.1631, lon: -72.5450, country: 'Peru', timezone: 'America/Lima' },
  rio: { lat: -22.9068, lon: -43.1729, country: 'Brazil', timezone: 'America/Sao_Paulo' },
  oaxaca: { lat: 17.0732, lon: -96.7266, country: 'Mexico', timezone: 'America/Mexico_City' },
  seoul: { lat: 37.5665, lon: 126.9780, country: 'South Korea', timezone: 'Asia/Seoul' },
  singapore: { lat: 1.3521, lon: 103.8198, country: 'Singapore', timezone: 'Asia/Singapore' },
  vienna: { lat: 48.2082, lon: 16.3738, country: 'Austria', timezone: 'Europe/Vienna' },
  lisbon: { lat: 38.7223, lon: -9.1393, country: 'Portugal', timezone: 'Europe/Lisbon' },
  queenstown: { lat: -45.0312, lon: 168.6626, country: 'New Zealand', timezone: 'Pacific/Auckland' },
};

// Weather API endpoint using free Open-Meteo with fallback
app.get('/api/weather', async (req: Request, res: Response) => {
  const cityKey = (req.query.city as string)?.toLowerCase().replace(/[\s-]/g, '') || 'tokyo';
  const coords = CITY_COORDINATES[cityKey] || CITY_COORDINATES.tokyo;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=${encodeURIComponent(coords.timezone)}&forecast_days=7`;
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (response.ok) {
      const data = await response.json();
      return res.json({ success: true, city: cityKey, data });
    }
  } catch (err) {
    console.warn('Open-Meteo fetch failed or timed out, returning rich estimated forecast:', err);
  }

  // Fallback realistic weather data
  return res.json({
    success: true,
    city: cityKey,
    isFallback: true,
    data: {
      current: {
        temperature_2m: 21.5,
        relative_humidity_2m: 54,
        apparent_temperature: 21.0,
        precipitation: 0,
        weather_code: 1,
        wind_speed_10m: 11.2,
      },
      daily: {
        time: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        weather_code: [1, 2, 0, 3, 1, 2, 0],
        temperature_2m_max: [23, 24, 22, 20, 22, 25, 23],
        temperature_2m_min: [15, 16, 14, 13, 15, 17, 16],
        precipitation_probability_max: [10, 20, 5, 40, 15, 10, 5],
        uv_index_max: [6.2, 6.8, 7.1, 5.0, 6.5, 7.3, 6.9],
      },
    },
  });
});

// Device Sync Endpoint: Save
app.post('/api/sync/save', (req: Request, res: Response) => {
  const { code, itinerary } = req.body;
  if (!code || !itinerary) {
    return res.status(400).json({ error: 'Code and itinerary are required' });
  }
  syncStore.set(code.toUpperCase(), {
    data: itinerary,
    updatedAt: Date.now(),
  });
  return res.json({ success: true, code: code.toUpperCase() });
});

// Device Sync Endpoint: Retrieve
app.get('/api/sync/get', (req: Request, res: Response) => {
  const code = (req.query.code as string)?.toUpperCase();
  if (!code || !syncStore.has(code)) {
    return res.status(404).json({ error: 'Sync code not found or expired' });
  }
  const entry = syncStore.get(code)!;
  return res.json({ success: true, itinerary: entry.data, updatedAt: entry.updatedAt });
});

// AI Itinerary Generation Endpoint
app.post('/api/generate-itinerary', async (req: Request, res: Response) => {
  const { profile, destination, durationDays = 3 } = req.body;

  if (!destination || !destination.city) {
    return res.status(400).json({ error: 'Destination is required' });
  }

  if (!aiClient) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not set or client unavailable. Using offline curated bespoke engine.',
    });
  }

  try {
    const prompt = `You are the lead travel concierge for Aetheria, an ultra-luxury bespoke travel house.
Generate a rich, deeply personalized ${durationDays}-day travel itinerary for the following guest profile:
Destination: ${destination.city}, ${destination.country}
Guest Profile:
- Name: ${profile.name || 'Discerning Guest'}
- Pace: ${profile.pace} (e.g. relaxed, balanced, immersive)
- Companions: ${profile.companion}
- Passions & Interests: ${Array.isArray(profile.passions) ? profile.passions.join(', ') : profile.passions}
- Dietary Preferences: ${Array.isArray(profile.dietary) ? profile.dietary.join(', ') : profile.dietary}
- Style & Tier: ${profile.tier}
- Special Notes: ${profile.notes || 'None'}

CRITICAL REQUIREMENT - DINING MIX:
Each day MUST include a thoughtful, deliberate variety of dining experiences across all styles:
1. One iconic street food stall / bustling local artisan food market.
2. One hidden local gem (neighborhood bistro, intimate back-alley ramen/tapas, authentic family-run institution).
3. One upscale / fine dining experience (chef's counter, Michelin-selected, or panoramic elevated dining).
4. One artisanal morning specialty cafe or afternoon cultural tea/pastry salon.

For EACH activity and dining stop, you MUST include:
- id: string
- title: string
- category: ("dining" | "culture" | "sight" | "market" | "hidden_gem" | "wellness" | "nightlife")
- diningType?: ("street_food" | "local_market" | "hidden_gem" | "upscale_restaurant" | "artisan_cafe")
- time: string (e.g., "09:00 AM")
- durationMinutes: number
- description: string (rich, evocative, sensory details)
- insiderTip: string (anticipatory advice, e.g., "Ask for table 4 near the cedar garden", "Order the charcoal-grilled sea bass")
- locationName: string (precise name of place)
- neighborhood: string
- coordinates: { lat: number, lng: number } (accurate for ${destination.city})
- bookingPlatform: ("OpenTable" | "Resy" | "TableCheck" | "TheFork" | "GetYourGuide" | "Viator" | "Klook" | "Direct")
- bookingLink: string (valid search or direct URL)
- priceEstimate: ("$" | "$$" | "$$$" | "$$$$")

Output MUST be strictly valid JSON without markdown fences matching this TypeScript interface:
{
  "tripTitle": string,
  "summary": string,
  "conciergePreamble": string,
  "culturalEtiquette": string[],
  "days": [
    {
      "dayNumber": number,
      "theme": string,
      "summary": string,
      "items": ActivityItem[]
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json({ success: true, itinerary: parsed });
  } catch (err: unknown) {
    console.error('Gemini itinerary generation failed:', err);
    const message = err instanceof Error ? err.message : 'Generation failed';
    return res.status(500).json({ error: message });
  }
});

// AI 24/7 Concierge Chat Endpoint with Google Maps Grounding
app.post('/api/chat-concierge', async (req: Request, res: Response) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  if (!aiClient) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not set. Switching to offline intelligent concierge.',
    });
  }

  try {
    const systemInstruction = `You are Aura, the private 24/7 AI Travel Concierge for Aetheria.
Your tone is elegant, anticipatory, deeply knowledgeable, warm and discreet.
Current trip context:
- Destination: ${context?.destination?.city || 'Selected Destination'}, ${context?.destination?.country || ''}
- Guest Profile: ${JSON.stringify(context?.profile || {})}
- Current Day Theme: ${context?.currentDayTheme || 'Exploration'}
- Current Weather: ${context?.weatherSummary || 'Pleasant'}

You assist guests during their live trip with up-to-date and accurate geospatial guidance:
- Use Google Maps data to locate authentic venues, opening hours, neighborhoods, and routing
- Instant rerouting when weather changes or guest is fatigued
- Finding secret spots nearby (speakeasies, street bites, quiet gardens, artisan workshops)
- Immediate reservation assistance, booking platform advice (OpenTable, Resy, TableCheck, TheFork)
- Local etiquette, tipping rules, taxi hailing instructions, and language nuances
Keep responses succinct, polished, actionable, and formatted with clean paragraphs or bullet points.`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        tools: [{ googleMaps: {} }],
      },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return res.json({
      success: true,
      reply: response.text || 'I am here at your service. How may I refine your journey today?',
      grounding: groundingMetadata,
    });
  } catch (err: unknown) {
    console.error('Concierge chat error:', err);
    const message = err instanceof Error ? err.message : 'Chat error';
    return res.status(500).json({ error: message });
  }
});

// Mount Vite or serve static assets
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Aetheria Concierge Server running on http://0.0.0.0:${PORT}`);
});
