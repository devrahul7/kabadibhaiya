'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Search, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Dynamic Leaflet map (client-only)
const PickupMapInner = dynamic(() => import('./PickupMapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-64 sm:h-72 w-full bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center text-gray-400 text-sm">
      <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary" /> Loading Interactive Kathmandu Map...
    </div>
  ),
});

const QUICK_LANDMARKS = [
  { name: 'New Baneshwor', lat: 27.6899, lng: 85.3356, city: 'Kathmandu' },
  { name: 'Patan Dhoka', lat: 27.6744, lng: 85.3211, city: 'Lalitpur' },
  { name: 'Koteshwor Chowk', lat: 27.6775, lng: 85.3486, city: 'Kathmandu' },
  { name: 'Kalanki Chowk', lat: 27.6934, lng: 85.2818, city: 'Kathmandu' },
  { name: 'Boudha Stupa', lat: 27.7215, lng: 85.3620, city: 'Kathmandu' },
  { name: 'Bhaktapur Durbar', lat: 27.6722, lng: 85.4283, city: 'Bhaktapur' },
  { name: 'Maitighar Mandala', lat: 27.6938, lng: 85.3215, city: 'Kathmandu' },
  { name: 'Chabahil Chowk', lat: 27.7170, lng: 85.3484, city: 'Kathmandu' },
];

export default function PickupLocationPicker({ value, onChange, city, onCityChange }) {
  const [lat, setLat] = useState(27.7172);
  const [lng, setLng] = useState(85.3240);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [landmarkDetail, setLandmarkDetail] = useState('');
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Reverse Geocode Coordinates via Nominatim ──────────────────────────────
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'KabadiBhaiya-Nepal/1.0' } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.display_name || null;
    } catch {
      return null;
    }
  };

  // ─── GPS Location Detection ──────────────────────────────────────────────────
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setLat(userLat);
        setLng(userLng);

        toast.loading('Fetching street address from GPS...', { id: 'gps-toast' });
        const streetAddress = await reverseGeocode(userLat, userLng);
        toast.dismiss('gps-toast');

        if (streetAddress) {
          const cleaned = streetAddress
            .split(',')
            .slice(0, 4)
            .join(', ')
            .trim();
          onChange(cleaned);
          toast.success('📍 Located your pickup spot!');
        } else {
          onChange(`GPS: ${userLat.toFixed(5)}, ${userLng.toFixed(5)}`);
          toast.success('Location coordinates detected');
        }

        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) {
          toast.error('GPS permission denied. Please allow location access or search your address below.');
        } else {
          toast.error('Could not detect GPS position. Try searching your address.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ─── Live Address Search Autocomplete (OpenStreetMap Nominatim) ─────────────
  const handleSearchChange = (text) => {
    setSearchQuery(text);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!text || text.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const query = `${encodeURIComponent(text.trim())} Nepal`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=np&limit=6&addressdetails=1`,
          { headers: { 'User-Agent': 'KabadiBhaiya-Nepal/1.0' } }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSearchResults(data || []);
        setShowResults(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  };

  // ─── Select Search Suggestion ────────────────────────────────────────────────
  const handleSelectSuggestion = (place) => {
    const selectedLat = parseFloat(place.lat);
    const selectedLng = parseFloat(place.lon);
    setLat(selectedLat);
    setLng(selectedLng);

    // Clean address
    const cleaned = place.display_name
      .split(',')
      .slice(0, 4)
      .join(', ')
      .trim();

    onChange(cleaned);
    setSearchQuery('');
    setShowResults(false);

    // Auto-detect city if matched
    const fullText = place.display_name.toLowerCase();
    if (fullText.includes('lalitpur') || fullText.includes('patan')) {
      onCityChange && onCityChange('Lalitpur');
    } else if (fullText.includes('bhaktapur') || fullText.includes('thimi')) {
      onCityChange && onCityChange('Bhaktapur');
    } else {
      onCityChange && onCityChange('Kathmandu');
    }

    toast.success(`Selected ${place.name || cleaned.split(',')[0]}`);
  };

  // ─── Quick Landmark Selection ────────────────────────────────────────────────
  const handleQuickLandmark = (item) => {
    setLat(item.lat);
    setLng(item.lng);
    onChange(`${item.name}, ${item.city}`);
    onCityChange && onCityChange(item.city);
    toast.success(`Centered to ${item.name}`);
  };

  // ─── Map Marker Dragged or Clicked ───────────────────────────────────────────
  const handleMapLocationChange = async (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
    const street = await reverseGeocode(newLat, newLng);
    if (street) {
      const cleaned = street.split(',').slice(0, 4).join(', ').trim();
      onChange(cleaned);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and GPS Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input with Autocomplete */}
        <div ref={dropdownRef} className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowResults(true); }}
              placeholder="Search area, chowk, landmark in Kathmandu..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
            />
            {searchLoading && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-60 overflow-y-auto">
              <div className="p-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                Matching Areas in Nepal
              </div>
              {searchResults.map((place, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(place)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50/50 border-b border-gray-50 transition-colors flex items-start gap-2.5 text-xs text-gray-700"
                >
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900">{place.name || place.display_name.split(',')[0]}</div>
                    <div className="text-[11px] text-gray-500 line-clamp-1">{place.display_name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Use GPS Button */}
        <button
          type="button"
          onClick={handleUseGps}
          disabled={gpsLoading}
          className="bg-accent hover:bg-accent-dark text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-accent/20 flex-shrink-0 disabled:opacity-70 active:scale-95"
        >
          {gpsLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Locating...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" /> Use Current Location (GPS)
            </>
          )}
        </button>
      </div>

      {/* Quick Landmark Chips */}
      <div>
        <div className="text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Quick Popular Spots:</div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_LANDMARKS.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickLandmark(item)}
              className="text-xs bg-gray-100 hover:bg-primary-light hover:text-primary-dark text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition-colors font-medium flex items-center gap-1"
            >
              <span>📍</span> {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map with Draggable Pin */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-semibold flex items-center gap-1 text-gray-700">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Pinpoint Your Pickup Location:
          </span>
          <span className="text-[11px] text-gray-400 italic">Drag pin or click map to refine</span>
        </div>
        <PickupMapInner lat={lat} lng={lng} onLocationChange={handleMapLocationChange} />
      </div>

      {/* Formatted Address Field */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
          Exact Street Address / Tole *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. New Baneshwor, Ward 10, Shanti Marga"
            className="w-full p-3.5 pl-10 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
          />
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Selected coordinates: <span className="font-mono text-gray-600">{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</span>
        </p>
      </div>

      {/* Landmark / Gate Details Refinement */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
          House No. / Landmark / Gate Details (Optional)
        </label>
        <input
          type="text"
          value={landmarkDetail}
          onChange={(e) => {
            setLandmarkDetail(e.target.value);
            // Append landmark to address if needed
          }}
          placeholder="e.g. House No. 24, Opposite Prabhu Bank, Red Gate, 2nd Floor"
          className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
        />
        <p className="text-[11px] text-gray-400 mt-1">
          Helps the scrap pickup vehicle find your house without calling multiple times.
        </p>
      </div>
    </div>
  );
}
