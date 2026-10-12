'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Type location...',
  required = false
}) => {
  const [query, setQuery] = useState<string>(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced search on query change via server-side /api/geocode endpoint
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSuggestions(data);
            setIsOpen(data.length > 0);
          }
        }
      } catch (err) {
        console.warn('Geocoding autocomplete warning:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (s: Suggestion) => {
    const shortName = s.name || s.display_name.split(',')[0];
    setQuery(shortName);
    onChange(shortName);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          required={required}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-white text-zinc-800 placeholder-pink-300 rounded-xl px-3.5 py-2.5 text-sm border-2 border-pink-200 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 shadow-[2px_2px_0px_#FBCFE8] transition-all pr-8"
        />

        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 text-pink-400 animate-spin absolute right-3" />
        ) : (
          <Search className="w-3.5 h-3.5 text-pink-300 absolute right-3 pointer-events-none" />
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border-2 border-pink-300 rounded-xl shadow-[4px_4px_0px_#F472B6] z-50 overflow-hidden max-h-56 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-pink-50 transition-colors border-b border-pink-100 last:border-0 flex items-start gap-2 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <div className="font-semibold text-zinc-800 truncate">
                  {s.name || s.display_name.split(',')[0]}
                </div>
                <div className="text-[10px] text-pink-500/80 truncate mt-0.5 font-mono">
                  {s.display_name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
