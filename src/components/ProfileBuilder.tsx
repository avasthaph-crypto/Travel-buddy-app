import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { GLOBAL_DESTINATIONS, PROFILE_PRESETS, createCustomDestination } from '../data/destinations';
import { GuestProfile, TravelPace, CompanionType, LuxuryTier, MobilityType } from '../types/travel';
import { X, Sparkles, Check, Globe2, Compass, HeartHandshake, User, Utensils, ShieldCheck } from 'lucide-react';

const PASSION_OPTIONS = [
  'Michelin & Fine Dining',
  'Night Markets & Street Food',
  'Secret Speakeasies',
  'Artisan Craft',
  'Ancient Temples & History',
  'Modern Architecture',
  'Wellness & Thermal Spas',
  'Scenic Photography',
  'Local Wine & Vintage Spirits',
  'Canal & River Cruising',
];

const DIETARY_OPTIONS = [
  'Adventurous Omnivore',
  'Fine Wine Pairing',
  'Vegetarian Friendly',
  'Vegan',
  'Gluten-Conscious',
  'Pescatarian',
  'Halal Friendly',
  'Kosher Style',
  'Kid-Friendly Options',
];

export const ProfileBuilder: React.FC = () => {
  const {
    showProfileModal,
    setShowProfileModal,
    activeDestination,
    setActiveDestination,
    guestProfile,
    setGuestProfile,
    durationDays,
    setDurationDays,
    createItinerary,
    isGeneratingItinerary,
  } = useTravel();

  // Selected Country & City state
  const [selectedCountry, setSelectedCountry] = useState<string>(activeDestination.country);
  const [selectedCityId, setSelectedCityId] = useState<string>(activeDestination.id);
  const [isCustomDestination, setIsCustomDestination] = useState<boolean>(false);
  const [customCountry, setCustomCountry] = useState<string>('');
  const [customCity, setCustomCity] = useState<string>('');

  // Profile form state
  const [name, setName] = useState<string>(guestProfile.name || 'Julian Vance');
  const [pace, setPace] = useState<TravelPace>(guestProfile.pace || 'balanced');
  const [companion, setCompanion] = useState<CompanionType>(guestProfile.companion || 'couple');
  const [tier, setTier] = useState<LuxuryTier>(guestProfile.tier || 'luxury');
  const [mobility, setMobility] = useState<MobilityType>(guestProfile.mobility || 'walking');
  const [passions, setPassions] = useState<string[]>(guestProfile.passions || ['Michelin & Fine Dining', 'Night Markets & Street Food']);
  const [dietary, setDietary] = useState<string[]>(guestProfile.dietary || ['Adventurous Omnivore']);
  const [notes, setNotes] = useState<string>(guestProfile.notes || '');
  const [localDays, setLocalDays] = useState<number>(durationDays);

  if (!showProfileModal) return null;

  // Extract unique countries
  const countries = Array.from(new Set(GLOBAL_DESTINATIONS.map((d) => d.country)));

  // Filter cities by selected country
  const availableCities = GLOBAL_DESTINATIONS.filter((d) => d.country === selectedCountry);

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    const firstCity = GLOBAL_DESTINATIONS.find((d) => d.country === newCountry);
    if (firstCity) {
      setSelectedCityId(firstCity.id);
    }
  };

  const handleApplyPreset = (preset: typeof PROFILE_PRESETS[0]) => {
    setName(preset.profile.name);
    setPace(preset.profile.pace);
    setCompanion(preset.profile.companion);
    setTier(preset.profile.tier);
    setMobility(preset.profile.mobility);
    setPassions(preset.profile.passions);
    setDietary(preset.profile.dietary);
    setNotes(preset.profile.notes || '');
  };

  const togglePassion = (item: string) => {
    setPassions((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    );
  };

  const toggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const destination = isCustomDestination && customCity.trim() && customCountry.trim()
      ? createCustomDestination(customCity.trim(), customCountry.trim())
      : GLOBAL_DESTINATIONS.find((d) => d.id === selectedCityId) || activeDestination;

    const updatedProfile: GuestProfile = {
      name: name.trim() || 'Discerning Guest',
      pace,
      companion,
      passions,
      dietary,
      tier,
      mobility,
      notes: notes.trim(),
    };

    setActiveDestination(destination);
    setGuestProfile(updatedProfile);
    setDurationDays(localDays);

    try {
      await createItinerary(destination, updatedProfile, localDays);
    } finally {
      setShowProfileModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl my-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-stone-900 dark:text-stone-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-amber-700 dark:text-amber-400 font-medium">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Bespoke Guest Profile & Destinations</span>
            </div>
            <h2 id="modal-title" className="text-2xl sm:text-3xl font-editorial font-bold mt-1 text-stone-900 dark:text-stone-50">
              Personalize Your Journey
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Select your global destination and fine-tune your travel profile for hyper-personalized daily schedules.
            </p>
          </div>
          <button
            onClick={() => setShowProfileModal(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Selection Bar */}
        <div className="my-5">
          <div className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">
            Curated Guest Profile Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROFILE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 bg-stone-50/60 dark:bg-stone-950/40 hover:bg-stone-100/80 dark:hover:bg-stone-900 transition-all text-xs"
              >
                <div className="font-semibold text-stone-900 dark:text-stone-100">{preset.title}</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{preset.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Destination Dropdowns: Country & City (with Custom Worldwide option) */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200/80 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                Destination Selection
              </span>
              <button
                type="button"
                onClick={() => setIsCustomDestination(!isCustomDestination)}
                className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline"
              >
                {isCustomDestination ? '← Use Curated Dropdowns' : '+ Enter Custom Country & City'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {isCustomDestination ? (
                <>
                  {/* Custom Country Input */}
                  <div>
                    <label htmlFor="custom-country" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                      Country
                    </label>
                    <input
                      id="custom-country"
                      type="text"
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      placeholder="e.g. Iceland, Jordan, Kenya"
                      className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required={isCustomDestination}
                    />
                  </div>

                  {/* Custom City Input */}
                  <div>
                    <label htmlFor="custom-city" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                      City / Region
                    </label>
                    <input
                      id="custom-city"
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="e.g. Reykjavik, Petra, Nairobi"
                      className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required={isCustomDestination}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Country Dropdown */}
                  <div>
                    <label htmlFor="country-select" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                      Country
                    </label>
                    <select
                      id="country-select"
                      value={selectedCountry}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Dropdown */}
                  <div>
                    <label htmlFor="city-select" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                      City / Region
                    </label>
                    <select
                      id="city-select"
                      value={selectedCityId}
                      onChange={(e) => setSelectedCityId(e.target.value)}
                      className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {availableCities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.city} ({city.currencySymbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Trip Duration */}
              <div>
                <label htmlFor="duration-select" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  Trip Duration
                </label>
                <select
                  id="duration-select"
                  value={localDays}
                  onChange={(e) => setLocalDays(Number(e.target.value))}
                  className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Day' : 'Days'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Guest Identity & Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guest-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Guest Name(s)
              </label>
              <input
                id="guest-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian & Claire Vance"
                className="w-full text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="companion-select" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Travel Party
              </label>
              <select
                id="companion-select"
                value={companion}
                onChange={(e) => setCompanion(e.target.value as CompanionType)}
                className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="couple">Couple / Romance</option>
                <option value="solo">Solo Explorer</option>
                <option value="family">Family with Children</option>
                <option value="friends">Private Friends Group</option>
                <option value="business">Business & Leisure</option>
              </select>
            </div>
          </div>

          {/* Travel Pace & Luxury Tier & Mobility */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Pace
              </label>
              <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
                {(['relaxed', 'balanced', 'intensive'] as TravelPace[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPace(p)}
                    className={`flex-1 py-1.5 text-xs font-medium capitalize rounded-md transition-all ${
                      pace === p
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Style & Tier
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as LuxuryTier)}
                className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="luxury">Signature Luxury</option>
                <option value="boutique">Curated Boutique</option>
                <option value="ultra_luxe">Ultra-Luxe / High Roller</option>
                <option value="authentic">Authentic Local Explorer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Mobility & Transit
              </label>
              <select
                value={mobility}
                onChange={(e) => setMobility(e.target.value as MobilityType)}
                className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="walking">Walking & Scenic Strolls</option>
                <option value="chauffeur">Private Chauffeur / Cabs</option>
                <option value="accessible">Accessible Step-Free</option>
              </select>
            </div>
          </div>

          {/* Passions & Interests (Multiselect Buttons) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                Key Passions & Interests
              </span>
              <span className="text-[11px] text-stone-400">Select all that inspire you</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PASSION_OPTIONS.map((passion) => {
                const isSelected = passions.includes(passion);
                return (
                  <button
                    key={passion}
                    type="button"
                    onClick={() => togglePassion(passion)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                        : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    {isSelected && <Check className="inline-block w-3 h-3 mr-1" />}
                    {passion}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dietary Preferences (Multiselect Buttons) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                Dietary & Dining Nuances
              </span>
              <span className="text-[11px] text-stone-400">For curated culinary pacing</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DIETARY_OPTIONS.map((item) => {
                const isSelected = dietary.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDietary(item)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                        : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    {isSelected && <Check className="inline-block w-3 h-3 mr-1" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Notes */}
          <div>
            <label htmlFor="concierge-notes" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
              Special Requests & Concierge Notes
            </label>
            <textarea
              id="concierge-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Celebrating our 10th anniversary; love quiet corner tables and artisanal pottery ateliers."
              className="w-full text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-3 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGeneratingItinerary}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingItinerary ? 'Curating Itinerary...' : 'Generate Bespoke Itinerary'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
