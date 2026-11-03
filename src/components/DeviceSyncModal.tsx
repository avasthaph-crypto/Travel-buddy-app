import React, { useState, useEffect, useRef } from 'react';
import { useTravel } from '../context/TravelContext';
import QRCode from 'qrcode';
import { 
  X, 
  Smartphone, 
  Copy, 
  Check, 
  CloudUpload, 
  Download, 
  RefreshCw, 
  Laptop, 
  ShieldCheck, 
  QrCode,
  FileDown
} from 'lucide-react';

export const DeviceSyncModal: React.FC = () => {
  const { 
    showSyncModal, 
    setShowSyncModal, 
    itinerary, 
    syncItineraryToCloud, 
    loadItineraryFromCloud 
  } = useTravel();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const syncUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#sync=${itinerary.syncCode}`
    : `https://aetheria.travel/#sync=${itinerary.syncCode}`;

  // Generate QR code on canvas whenever modal opens or code changes
  useEffect(() => {
    if (showSyncModal && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        syncUrl,
        {
          width: 200,
          margin: 1,
          color: {
            dark: '#1c1917',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [showSyncModal, syncUrl]);

  if (!showSyncModal) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(syncUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(itinerary.syncCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleUploadSync = async () => {
    setIsSyncing(true);
    const code = await syncItineraryToCloud();
    setIsSyncing(false);
    setSyncStatusMessage(`Itinerary successfully synchronized to cloud vault under code ${code}.`);
    setTimeout(() => setSyncStatusMessage(null), 4000);
  };

  const handleLoadByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsSyncing(true);
    const success = await loadItineraryFromCloud(inputCode.trim());
    setIsSyncing(false);

    if (success) {
      setSyncStatusMessage('Itinerary imported and synchronized successfully!');
      setTimeout(() => {
        setSyncStatusMessage(null);
        setShowSyncModal(false);
      }, 1500);
    } else {
      setSyncStatusMessage('Unable to find itinerary with that code. Please verify the code.');
    }
  };

  const handleDownloadOfflineKit = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(itinerary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Aetheria_${itinerary.destination.city}_Itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl my-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-stone-900 dark:text-stone-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sync-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-amber-700 dark:text-amber-400 font-medium">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Cross-Device Mobile Synchronization</span>
            </div>
            <h2 id="sync-modal-title" className="text-2xl font-editorial font-bold mt-1 text-stone-900 dark:text-stone-50">
              Sync Across All Devices
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Access your real-time itinerary, offline maps, and reservations seamlessly on your phone, tablet, and partner's device.
            </p>
          </div>
          <button
            onClick={() => setShowSyncModal(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert if any */}
        {syncStatusMessage && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            {syncStatusMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 items-center">
          
          {/* Left: QR Code for Camera Scan */}
          <div className="flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-950/60 rounded-xl border border-stone-200 dark:border-stone-800 text-center">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-200">
              <canvas ref={canvasRef} />
            </div>
            <div className="mt-3 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-amber-600" />
              <span>Scan with Phone Camera</span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              Opens full itinerary with offline caching directly on mobile.
            </p>
          </div>

          {/* Right: 6-Character Sync Code & Cloud Vault Actions */}
          <div className="space-y-4">
            
            {/* Sync Code Box */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Your Private Sync Code
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-3xl font-mono font-bold tracking-widest text-amber-700 dark:text-amber-400">
                  {itinerary.syncCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md hover:bg-stone-100 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Direct Link */}
            <div>
              <div className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                Shareable Link
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={syncUrl}
                  className="flex-1 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-600 dark:text-stone-300 font-mono truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 rounded-lg hover:opacity-90 shrink-0 transition-opacity"
                >
                  {copiedLink ? 'Copied' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Cloud Vault Push */}
            <button
              onClick={handleUploadSync}
              disabled={isSyncing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-2xs"
            >
              <CloudUpload className="w-4 h-4" />
              <span>{isSyncing ? 'Syncing...' : 'Sync to Cloud Vault Now'}</span>
            </button>

          </div>

        </div>

        {/* Pair / Import from Another Device Form */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
          <form onSubmit={handleLoadByCode} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="text-xs font-medium text-stone-600 dark:text-stone-400 whitespace-nowrap">
              Import from another device:
            </div>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit sync code"
              maxLength={8}
              className="flex-1 text-xs uppercase tracking-wider font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!inputCode.trim() || isSyncing}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Load Trip
            </button>
          </form>
        </div>

        {/* Offline Kit Download Footer */}
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted offline vault saved in browser storage</span>
          </div>

          <button
            onClick={handleDownloadOfflineKit}
            className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium underline"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Offline JSON Vault</span>
          </button>
        </div>

      </div>
    </div>
  );
};
