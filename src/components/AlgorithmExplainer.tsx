'use client';

import React, { useState } from 'react';
import { Cpu, Dna, Trophy, Scissors, RefreshCw, Star, Compass, ArrowRight, Check } from 'lucide-react';

export const AlgorithmExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chromosome' | 'selection' | 'crossover' | 'mutation' | 'elitism'>('chromosome');

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">AI Engine Architecture Walkthrough</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Interactive visual breakdown of Genetic Algorithm operators and Heuristic Search concepts in Ai-ternary.
          </p>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800/80">
        <button
          type="button"
          onClick={() => setActiveTab('chromosome')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'chromosome'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Dna className="w-3.5 h-3.5" />
          1. Chromosomes & Fitness
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('selection')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'selection'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          2. Tournament Selection
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crossover')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'crossover'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          3. Ordered Crossover (OX)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mutation')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'mutation'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          4. Swap Mutation
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('elitism')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'elitism'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          5. Elitism & NN Heuristic
        </button>
      </div>

      {/* Tab 1: Chromosome & Fitness */}
      {activeTab === 'chromosome' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 mb-2">Chromosome Formulation</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              In Genetic Algorithms applied to the Traveling Salesperson Problem (TSP), a <strong>chromosome</strong> represents a complete candidate travel route encoded as an ordered sequence of location IDs (genes).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 space-y-3 font-mono text-xs">
            <div className="text-slate-400 text-[11px] font-sans font-semibold uppercase">Chromosome Structure Example:</div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30">Start: Jaipur</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-800">Gene 1: Jal Mahal</span>
              <span className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-800">Gene 2: Amer Fort</span>
              <span className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-800">Gene 3: Hawa Mahal</span>
              <span className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-800">Gene 4: City Palace</span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-300 font-sans">
              <span>Fitness Function:</span>
              <code className="text-emerald-400 font-mono font-bold bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                Fitness = 1 / Total Haversine Distance (km)
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Selection */}
      {activeTab === 'selection' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 mb-2">Tournament Selection Operator (k = 5)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              To choose parents for reproduction, <strong>k = 5 random chromosomes</strong> are sampled from the population. The chromosome with the highest fitness score wins the tournament and is chosen as a parent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-sans font-semibold">Candidate 1</div>
              <div className="text-slate-300 mt-1">Distance: 310.2 km</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Fitness: 0.00322</div>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 shadow-lg shadow-cyan-900/20">
              <div className="text-[11px] text-cyan-300 font-sans font-bold flex items-center justify-between">
                Candidate 2 (Winner) <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-cyan-100 font-bold mt-1">Distance: 247.3 km</div>
              <div className="text-emerald-400 font-bold text-[11px] mt-0.5">Fitness: 0.00404 ★</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-sans font-semibold">Candidate 3</div>
              <div className="text-slate-300 mt-1">Distance: 289.0 km</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Fitness: 0.00346</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Crossover */}
      {activeTab === 'crossover' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 mb-2">Ordered Crossover (OX) Operator</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard single-point crossover produces duplicate cities in routes. <strong>Ordered Crossover (OX)</strong> preserves relative ordering of cities by copying a contiguous slice from Parent A and filling remaining slots in order from Parent B.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Parent A:</span>
              <span className="text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">[A, <strong className="text-emerald-400">B, C, D</strong>, E]</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Parent B:</span>
              <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded">[C, E, A, D, B]</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-200">
              <span className="font-sans font-bold text-cyan-300">Child (OX):</span>
              <span className="text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                [E, <strong className="text-emerald-400">B, C, D</strong>, A]
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Mutation */}
      {activeTab === 'mutation' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 mb-2">Swap Mutation Operator (5% Rate)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mutation maintains genetic diversity and prevents population stagnation. Swap mutation picks two gene positions at random and swaps their values.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Before Mutation:</span>
              <span className="text-slate-300">[Amer Fort, <span className="text-rose-400 font-bold bg-rose-950/60 px-1.5 rounded">Jal Mahal</span>, Hawa Mahal, <span className="text-rose-400 font-bold bg-rose-950/60 px-1.5 rounded">City Palace</span>]</span>
            </div>
            <div className="flex items-center justify-between text-slate-200">
              <span className="font-sans font-bold text-cyan-300">After Swap:</span>
              <span className="text-emerald-300">[Amer Fort, <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 rounded">City Palace</span>, Hawa Mahal, <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 rounded">Jal Mahal</span>]</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Elitism & Heuristic */}
      {activeTab === 'elitism' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 mb-2">Nearest Neighbor Heuristic & Elitism Strategy</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The <strong>Nearest Neighbor (NN) Heuristic</strong> seeds Chromosome 1 with a greedy solution, giving the GA a strong starting point. <strong>Elitism (Top 5)</strong> guarantees top solutions pass into the next generation without modification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/20">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
                <Compass className="w-3.5 h-3.5" /> Nearest Neighbor Heuristic
              </div>
              <p className="text-slate-400 text-[11px]">
                Greedy search algorithm that selects the closest unvisited location next. Provides fast baseline route.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/20">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
                <Star className="w-3.5 h-3.5" /> Elitism Strategy
              </div>
              <p className="text-slate-400 text-[11px]">
                Top 5 fittest chromosomes bypass crossover/mutation directly into next generation, preserving peak fitness scores.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
