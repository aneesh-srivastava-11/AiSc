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

  // Debounced search on query change
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
          {
            headers: {
              'User-Agent': 'Ai-ternary-TravelPlanner/1.0'
            }
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSuggestions(data);
            setIsOpen(data.length > 0);
          }
        }
      } catch (err) {
        console.warn('OSM Autocomplete error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

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
    // Extract short name or display name
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
          className="w-full bg-zinc-900/90 text-zinc-100 placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-sm border border-zinc-800/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all pr-8"
        />

        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin absolute right-3" />
        ) : (
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 pointer-events-none" />
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden max-h-56 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-zinc-800/80 transition-colors border-b border-zinc-800/40 last:border-0 flex items-start gap-2 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <div className="font-semibold text-zinc-200 truncate">
                  {s.name || s.display_name.split(',')[0]}
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">
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
