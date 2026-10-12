'use client';

import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Play, Sparkles, Cpu, Dna, Compass, GitBranch, Layers, Award } from 'lucide-react';
import { AlgorithmType, GAConfig, OptimizeRequest } from '@/types/route';
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
  const [startLocation, setStartLocation] = useState<string>('');
  const [destinations, setDestinations] = useState<string[]>(['', '']);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'all' | AlgorithmType>('all');

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
      config: fixedConfig,
      selectedAlgorithm
    });
  };

  return (
    <div className="pro-card rounded-2xl p-6 border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-pink-100">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pink-500" />
            <h2 className="text-lg font-pixel font-bold text-pink-950">
              Travel Itinerary Configuration
            </h2>
          </div>
          <p className="text-xs text-pink-700/80 mt-0.5 font-sans">
            Type location names below or select from instant OpenStreetMap autocomplete suggestions.
          </p>
        </div>

        {/* Sample Data Fill Button */}
        <button
          type="button"
          onClick={handleFillSample}
          className="pixel-btn text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-600" />
          Load Jaipur Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Starting Location Autocomplete */}
        <div>
          <label className="block text-xs font-pixel font-bold uppercase tracking-wider text-pink-900 mb-2">
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
            <label className="text-xs font-pixel font-bold uppercase tracking-wider text-pink-900">
              Destinations ({destinations.length})
            </label>
            <span className="text-[11px] font-mono text-pink-500">Min 2, Max 10</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {destinations.map((dest, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-pink-100 border border-pink-300 text-pink-800 font-pixel text-xs flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#F472B6]">
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
                    className="p-2 text-pink-400 hover:text-rose-600 hover:bg-pink-100 rounded-lg transition-colors cursor-pointer shrink-0"
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
              className="mt-3 pixel-btn text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-pink-600" />
              Add Destination Node
            </button>
          )}
        </div>

        {/* Algorithm Execution Mode Selector */}
        <div className="pt-3 border-t border-pink-100">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-pixel font-bold uppercase tracking-wider text-pink-950 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-pink-500" />
              Algorithm Execution Mode
            </label>
            <span className="text-[11px] text-pink-600 font-pixel">5 AI Search Engines</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedAlgorithm('all')}
              className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedAlgorithm === 'all'
                  ? 'bg-pink-100/90 border-pink-500 text-pink-950 shadow-[3px_3px_0px_#DB2777]'
                  : 'bg-white border-pink-200 text-zinc-600 hover:border-pink-300 hover:bg-pink-50/50 shadow-[2px_2px_0px_#FBCFE8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-pixel font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-pink-600" /> All (Benchmark)
                </span>
                <span className="text-[9px] font-pixel px-1.5 py-0.2 rounded bg-pink-200 text-pink-800 border border-pink-300">
                  Arena
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 line-clamp-1 font-sans">Side-by-side comparison</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAlgorithm('astar')}
              className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedAlgorithm === 'astar'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-[3px_3px_0px_#059669]'
                  : 'bg-white border-pink-200 text-zinc-600 hover:border-emerald-300 hover:bg-emerald-50/40 shadow-[2px_2px_0px_#FBCFE8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-pixel font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> A* Search
                </span>
                <span className="text-[9px] font-pixel px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Optimal
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 line-clamp-1 font-sans">MST Admissible Heuristic</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAlgorithm('ga')}
              className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedAlgorithm === 'ga'
                  ? 'bg-pink-100 border-pink-500 text-pink-950 shadow-[3px_3px_0px_#DB2777]'
                  : 'bg-white border-pink-200 text-zinc-600 hover:border-pink-300 hover:bg-pink-50/40 shadow-[2px_2px_0px_#FBCFE8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-pixel font-bold flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5 text-pink-500" /> Genetic (GA)
                </span>
                <span className="text-[9px] font-pixel px-1.5 py-0.2 rounded bg-pink-200 text-pink-800 border border-pink-300">
                  100 Gen
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 line-clamp-1 font-sans">OX Crossover & Mutation</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAlgorithm('greedy')}
              className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedAlgorithm === 'greedy'
                  ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-[3px_3px_0px_#D97706]'
                  : 'bg-white border-pink-200 text-zinc-600 hover:border-amber-300 hover:bg-amber-50/40 shadow-[2px_2px_0px_#FBCFE8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-pixel font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-500" /> Greedy (NN)
                </span>
                <span className="text-[9px] font-pixel px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  O(N²)
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 line-clamp-1 font-sans">Nearest Neighbor Step</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAlgorithm('bfs')}
              className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedAlgorithm === 'bfs'
                  ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-[3px_3px_0px_#7C3AED]'
                  : 'bg-white border-pink-200 text-zinc-600 hover:border-purple-300 hover:bg-purple-50/40 shadow-[2px_2px_0px_#FBCFE8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-pixel font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-500" /> BFS Search
                </span>
                <span className="text-[9px] font-pixel px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300">
                  Level B&B
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 line-clamp-1 font-sans">FIFO Queue Pruned</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAlgorithm('dfs')}
              className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedAlgorithm === 'dfs'
                  ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-[3px_3px_0px_#E11D48]'
                  : 'bg-white border-pink-200 text-zinc-600 hover:border-rose-300 hover:bg-rose-50/40 shadow-[2px_2px_0px_#FBCFE8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-pixel font-bold flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-rose-500" /> DFS Search
                </span>
                <span className="text-[9px] font-pixel px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300">
                  Deep B&B
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 line-clamp-1 font-sans">LIFO Stack Backtrack</span>
            </button>
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isLoading}
          className="pixel-btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Running Search Algorithms...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>
                {selectedAlgorithm === 'all'
                  ? 'Execute Multi-Algorithm Benchmark (A*, GA, Greedy, BFS, DFS)'
                  : `Calculate Optimal Route with ${
                      selectedAlgorithm === 'astar'
                        ? 'A* Search'
                        : selectedAlgorithm === 'ga'
                        ? 'Genetic Algorithm'
                        : selectedAlgorithm === 'greedy'
                        ? 'Greedy Search'
                        : selectedAlgorithm === 'bfs'
                        ? 'BFS Search'
                        : 'DFS Search'
                    }`}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
