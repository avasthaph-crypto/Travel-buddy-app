import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { ActivityItem } from '../types/travel';
import { 
  CalendarCheck2, 
  ExternalLink, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Save, 
  Printer, 
  Calendar,
  Share2
} from 'lucide-react';

export const ReservationsManager: React.FC = () => {
  const { itinerary, reservations, updateReservation, setShowSyncModal } = useTravel();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editTime, setEditTime] = useState<string>('');

  // Collect all bookable items across all days
  const bookableActivities: Array<{ item: ActivityItem; dayNumber: number }> = [];
  itinerary.days.forEach((day) => {
    day.items.forEach((item) => {
      bookableActivities.push({ item, dayNumber: day.dayNumber });
    });
  });

  const confirmedCount = bookableActivities.filter(({ item }) => reservations[item.id]?.status === 'confirmed').length;
  const requestedCount = bookableActivities.filter(({ item }) => reservations[item.id]?.status === 'requested').length;

  const handleStartEdit = (id: string, currentNotes?: string, currentTime?: string) => {
    setEditingId(id);
    setEditNotes(currentNotes || '');
    setEditTime(currentTime || '');
  };

  const handleSaveEdit = (id: string, currentStatus: 'unreserved' | 'requested' | 'confirmed') => {
    updateReservation(id, currentStatus, editNotes, editTime);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold mb-1">
            Integrated Booking Ledger & Passes
          </div>
          <h1 className="text-3xl font-editorial font-bold text-stone-900 dark:text-stone-50">
            {itinerary.destination.city} Reservations
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Synchronized table reservations, museum skip-the-line passes, and counter omakase bookings.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ledger</span>
          </button>
          <button
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-2xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Sync to Mobile Wallet</span>
          </button>
        </div>
      </div>

      {/* Overview Status Bar (Zero-pill discipline: unboxed text metrics) */}
      <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div>
            <span className="block text-xl font-bold text-stone-900 dark:text-stone-100">
              {bookableActivities.length}
            </span>
            <span className="text-stone-500 dark:text-stone-400">Total Curated Stops</span>
          </div>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
          <div>
            <span className="block text-xl font-bold text-emerald-700 dark:text-emerald-400">
              {confirmedCount}
            </span>
            <span className="text-stone-500 dark:text-stone-400">Confirmed Reservations</span>
          </div>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
          <div>
            <span className="block text-xl font-bold text-amber-700 dark:text-amber-400">
              {requestedCount}
            </span>
            <span className="text-stone-500 dark:text-stone-400">Pending Requests</span>
          </div>
        </div>

        <div className="text-stone-500 dark:text-stone-400 max-w-sm text-right">
          Direct links connect directly to local host partners (TableCheck, OpenTable, Resy, TheFork, GetYourGuide).
        </div>
      </div>

      {/* Reservation Table Ledger */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100/75 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
              <th className="py-3.5 px-4">Day & Time</th>
              <th className="py-3.5 px-4">Establishment / Experience</th>
              <th className="py-3.5 px-4">Booking Partner</th>
              <th className="py-3.5 px-4">Reservation Status</th>
              <th className="py-3.5 px-4">Guest Reference / Notes</th>
              <th className="py-3.5 px-4 text-right">Platform Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
            {bookableActivities.map(({ item, dayNumber }) => {
              const resData = reservations[item.id] || { status: 'unreserved' };
              const isEditing = editingId === item.id;

              return (
                <tr key={`${item.id}-day-${dayNumber}`} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                  
                  {/* Day & Time */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Day {dayNumber}</span>
                    <span className="block text-stone-500 dark:text-stone-400 font-medium">
                      {resData.timeSlot || item.time}
                    </span>
                  </td>

                  {/* Title & Neighborhood */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                      {item.title}
                    </div>
                    <div className="text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{item.locationName} · {item.neighborhood}</span>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {item.bookingPlatform}
                    </span>
                    <span className="block text-[11px] text-stone-400">{item.priceEstimate}</span>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        updateReservation(
                          item.id,
                          resData.status === 'confirmed'
                            ? 'unreserved'
                            : resData.status === 'requested'
                            ? 'confirmed'
                            : 'requested',
                          resData.notes,
                          resData.timeSlot
                        )
                      }
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all ${
                        resData.status === 'confirmed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : resData.status === 'requested'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {resData.status === 'confirmed'
                        ? 'Confirmed ✓'
                        : resData.status === 'requested'
                        ? 'Requested · Waiting'
                        : 'Unreserved (Tap)'}
                    </button>
                  </td>

                  {/* Notes / Edit */}
                  <td className="py-4 px-4">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Confirmation # or notes"
                          className="px-2 py-1 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded w-48 text-stone-900 dark:text-stone-100"
                        />
                        <button
                          onClick={() => handleSaveEdit(item.id, resData.status)}
                          className="p-1 text-emerald-600 hover:text-emerald-700"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                        <span>{resData.notes || 'No confirmation note added'}</span>
                        <button
                          onClick={() => handleStartEdit(item.id, resData.notes, resData.timeSlot)}
                          className="opacity-40 hover:opacity-100 text-stone-500"
                          title="Add confirmation reference"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* External Platform Action */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <a
                      href={item.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-md transition-colors"
                    >
                      <span>Open {item.bookingPlatform}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
