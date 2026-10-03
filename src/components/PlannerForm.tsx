'use client';

import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Play, Sparkles } from 'lucide-react';
import { GAConfig, OptimizeRequest } from '@/types/route';
import { LocationAutocomplete } from './LocationAutocomplete';

interface PlannerFormProps {
  onOptimize: (request: OptimizeRequest) => void;
  isLoading: boolean;
}

const JAIPUR_PRESET = {
  start: 'Jaipur',
  destinations: [
    'Amer Fort',
    'Jal Mahal',
    'Hawa Mahal',
    'City Palace',
    'Nahargarh Fort'
  ]
};

export const PlannerForm: React.FC<PlannerFormProps> = ({ onOptimize, isLoading }) => {
  // Default state is EMPTY
  const [startLocation, setStartLocation] = useState<string>('');
  const [destinations, setDestinations] = useState<string[]>(['', '']);

  // Fixed optimal GA configuration
  const fixedConfig: GAConfig = {
    populationSize: 100,
    generations: 100,
    tournamentSize: 5,
    mutationRate: 0.05,
    eliteCount: 5
  };

  const handleAddDestination = () => {
    if (destinations.length < 10) {
      setDestinations([...destinations, '']);
    }
  };

  const handleRemoveDestination = (index: number) => {
    if (destinations.length > 2) {
      const updated = destinations.filter((_, i) => i !== index);
      setDestinations(updated);
    }
  };

  const handleDestinationChange = (index: number, value: string) => {
    const updated = [...destinations];
    updated[index] = value;
    setDestinations(updated);
  };

  const handleFillSample = () => {
    setStartLocation(JAIPUR_PRESET.start);
    setDestinations([...JAIPUR_PRESET.destinations]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDests = destinations.filter(d => d.trim().length > 0);
    if (!startLocation.trim() || cleanDests.length < 1) return;

    onOptimize({
      start: startLocation.trim(),
      destinations: cleanDests,
      config: fixedConfig
    });
  };

  return (
    <div className="pro-card rounded-2xl p-6 border border-zinc-800 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <h2 className="text-lg font-bold text-zinc-100">Travel Itinerary Configuration</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Type location names below to select live OpenStreetMap autocomplete suggestions.
          </p>
        </div>

        {/* Sample Data Fill */}
        <button
          type="button"
          onClick={handleFillSample}
          className="text-xs font-medium text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          Load Sample Locations
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Starting Location Autocomplete */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
            Starting Location (Origin)
          </label>
          <LocationAutocomplete
            required
            value={startLocation}
            onChange={setStartLocation}
            placeholder="Search starting location (e.g. Jaipur)"
          />
        </div>

        {/* Destination Autocomplete List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Destinations ({destinations.length})
            </label>
            <span className="text-[11px] text-zinc-500">Min 2, Max 10</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {destinations.map((dest, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <div className="flex-1">
                  <LocationAutocomplete
                    required
                    value={dest}
                    onChange={val => handleDestinationChange(index, val)}
                    placeholder={`Search destination ${index + 1}`}
                  />
                </div>

                {destinations.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDestination(index)}
                    className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Remove destination"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {destinations.length < 10 && (
            <button
              type="button"
              onClick={handleAddDestination}
              className="mt-3 text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Destination Node
            </button>
          )}
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
              <span>Optimizing Route...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-zinc-900" />
              <span>Calculate Optimal Travel Route</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
