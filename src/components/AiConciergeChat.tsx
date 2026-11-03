import React, { useState, useRef, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { ChatMessage } from '../types/travel';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  MapPin, 
  Compass, 
  Wine, 
  CloudRain, 
  Languages, 
  ShieldAlert,
  Loader2
} from 'lucide-react';

export const AiConciergeChat: React.FC = () => {
  const { itinerary, activeDayIndex, weather, guestProfile, activeDestination, isOffline } = useTravel();
  const activeDay = itinerary.days[activeDayIndex] || itinerary.days[0];

  const initialGreeting: ChatMessage = {
    id: 'initial',
    role: 'model',
    content: `Good day, ${guestProfile.name || 'honored guest'}. I am Aura, your private 24/7 travel concierge for ${activeDestination.city}. I am monitoring your Day ${activeDay.dayNumber} itinerary ("${activeDay.theme}") and current weather conditions. How may I refine your journey today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    {
      label: 'Secret speakeasy nearby',
      query: `What is a discreet hidden speakeasy or intimate nightcap bar near our Day ${activeDay.dayNumber} evening stop?`,
      icon: Wine,
    },
    {
      label: 'Rain contingency plan',
      query: `If rain occurs this afternoon, what indoor cultural or tea salon alternative would you recommend in ${activeDestination.city}?`,
      icon: CloudRain,
    },
    {
      label: 'Local etiquette & tipping',
      query: `What are the exact tipping, taxi, and dining payment etiquette rules we should observe in ${activeDestination.city}, ${activeDestination.country}?`,
      icon: Compass,
    },
    {
      label: 'Polite language translation',
      query: `Translate two polite phrases in ${activeDestination.language}: "A quiet table for two, please" and "Could you recommend your signature chef dish?"`,
      icon: Languages,
    },
    {
      label: 'Emergency & health concierge',
      query: `Provide emergency numbers, medical helpline, and English-speaking pharmacy assistance for ${activeDestination.city}.`,
      icon: ShieldAlert,
    },
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const produceOfflineReply = () => {
      let reply = `It is our pleasure to assist. For your journey in ${activeDestination.city}, our concierge team has already pre-verified your itinerary for Day ${activeDay.dayNumber}. `;
      const lower = userText.toLowerCase();

      if (lower.includes('speakeasy') || lower.includes('bar') || lower.includes('nightcap')) {
        reply = `For an exceptional evening in ${activeDestination.city}, we recommend slipping into the neighborhood's premier discreet salon. Enjoy low amber lighting, masterfully carved clear ice, and single-cask botanicals. Simply mention you are staying under the Aetheria itinerary for preferred corner banquette seating.`;
      } else if (lower.includes('rain') || lower.includes('weather') || lower.includes('indoor')) {
        reply = `Should raindrops grace ${activeDestination.city}, your morning walking route can be seamlessly substituted with an unhurried visit to the local private art pavilion or a warm ceremonial tea salon. Most local taxis can be hailed directly from the front porte-cochère.`;
      } else if (lower.includes('tip') || lower.includes('etiquette') || lower.includes('custom')) {
        reply = `In ${activeDestination.city}, ${activeDestination.culturalEtiquette.join(' ')} In fine dining establishments, service is graciously appreciated and often included on the final bill.`;
      } else if (lower.includes('translate') || lower.includes('phrase') || lower.includes('language')) {
        reply = `Here are polite phrases in ${activeDestination.language} for your convenience:\n\n• "A quiet table, please" — ${
          activeDestination.language === 'Japanese'
            ? 'Shizuka na seki o onegaishimasu (静かな席をお願いします)'
            : activeDestination.language === 'French'
            ? 'Une table au calme, s’il vous plaît'
            : activeDestination.language === 'Italian'
            ? 'Un tavolo tranquillo, per favore'
            : 'A quiet table, please'
        }\n\n• "What is your signature dish?" — ${
          activeDestination.language === 'Japanese'
            ? 'Osusume no ryori wa nan desu ka? (おすすめの料理は何ですか)'
            : activeDestination.language === 'French'
            ? 'Quel est le plat signature du chef ?'
            : activeDestination.language === 'Italian'
            ? 'Qual è il piatto forte dello chef?'
            : 'What is the signature dish?'
        }`;
      } else if (lower.includes('emergency') || lower.includes('health') || lower.includes('doctor')) {
        reply = `For ${activeDestination.city}, emergency services are reached at ${
          activeDestination.country === 'Japan'
            ? '119 (Ambulance/Fire) or 110 (Police)'
            : activeDestination.country === 'France' || activeDestination.country === 'Italy' || activeDestination.country === 'Spain'
            ? '112 (European Emergency Line)'
            : '911'
        }. In addition, the central international hospital concierge provides English-speaking medical consultations 24 hours a day.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsLoading(false);
    };

    try {
      if (!isOffline) {
        const response = await fetch('/api/chat-concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(3500),
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context: {
              destination: activeDestination,
              profile: guestProfile,
              currentDayTheme: activeDay.theme,
              weatherSummary: `${weather?.current.temp}°C, ${weather?.current.condition}`,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.reply) {
            const groundingPlaces: Array<{ title: string; uri?: string }> = [];
            if (data.grounding?.groundingChunks) {
              data.grounding.groundingChunks.forEach((chunk: any) => {
                if (chunk.maps?.title || chunk.web?.title) {
                  groundingPlaces.push({
                    title: chunk.maps?.title || chunk.web?.title,
                    uri: chunk.maps?.uri || chunk.web?.uri,
                  });
                }
              });
            }

            setMessages((prev) => [
              ...prev,
              {
                id: `model-${Date.now()}`,
                role: 'model',
                content: data.reply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                groundingPlaces: groundingPlaces.length > 0 ? groundingPlaces : undefined,
              },
            ]);
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('AI Concierge online call failed, switching to bespoke offline concierge:', err);
    }

    // High fidelity offline fallback concierge responses
    produceOfflineReply();
  };

  const handleReset = () => {
    setMessages([initialGreeting]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400 text-stone-950 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-editorial font-bold text-stone-900 dark:text-stone-50">
              Aura · 24/7 AI Travel Concierge
            </h1>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Service
              </span>
              <span aria-hidden="true">·</span>
              <span>{activeDestination.city} Live Ground Support</span>
              {isOffline && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Offline Vault Mode</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="Restart conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts Segmented Bar */}
      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-2">
          Anticipatory Quick Inquiries
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(qp.query)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-lg transition-colors shrink-0 disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="h-[460px] sm:h-[500px] overflow-y-auto p-4 sm:p-6 rounded-2xl bg-stone-100/60 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 flex items-center justify-center shrink-0 text-xs font-bold">
                  A
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-amber-400 text-stone-950 font-medium rounded-tr-xs'
                    : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-800 shadow-2xs rounded-tl-xs whitespace-pre-line'
                }`}
              >
                <div>{msg.content}</div>

                {/* Grounded Google Maps Places (when available) */}
                {msg.groundingPlaces && msg.groundingPlaces.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>Verified via Google Maps Data:</span>
                    </div>
                    {msg.groundingPlaces.map((pl, pIdx) => (
                      <div key={pIdx} className="text-[11px] flex items-center justify-between text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 p-1.5 rounded">
                        <span>{pl.title}</span>
                        {pl.uri && (
                          <a href={pl.uri} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                            View on Maps ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 ${
                    isUser ? 'text-stone-800/70 text-right' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 flex items-center justify-center shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 flex items-center justify-center shrink-0 text-xs font-bold">
              A
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>Aura is consulting ground intelligence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="mt-4 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Aura anything about your itinerary, dining, or navigation..."
          className="flex-1 text-xs sm:text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-3 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

    </div>
  );
};
