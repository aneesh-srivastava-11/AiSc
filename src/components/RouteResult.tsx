'use client';

import React from 'react';
import { Compass, Zap, ArrowRight, CheckCircle2, TrendingUp, Cpu } from 'lucide-react';
import { GAResult } from '@/types/route';

interface RouteResultProps {
  result: GAResult;
}

export const RouteResult: React.FC<RouteResultProps> = ({ result }) => {
  const {
    startLocation,
    bestRoute,
    totalDistance,
    fitnessScore,
    generationsRun,
    heuristicDistance,
    improvementPercentage,
    executionTimeMs
  } = result;

  const completePath = [startLocation, ...bestRoute, startLocation];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pro-card p-6 rounded-2xl border border-zinc-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-100">
              <Compass className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-100">Optimized Travel Route</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> GA Optimized
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Calculated using Genetic Algorithm (OX Crossover & Swap Mutation) + OpenStreetMap Geocoding
              </p>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-right self-start md:self-auto">
            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Latency</div>
            <div className="text-xs font-mono font-bold text-zinc-200">{executionTimeMs} ms</div>
          </div>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Distance */}
        <div className="pro-card p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Distance</span>
            <Compass className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-100">{totalDistance} <span className="text-xs font-sans font-normal text-zinc-400">km</span></div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Real Haversine Distance</span>
        </div>

        {/* Metric 2: Fitness Score */}
        <div className="pro-card p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Fitness Score</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-200">{fitnessScore}</div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Fitness = 1 / Distance_km</span>
        </div>

        {/* Metric 3: Generations */}
        <div className="pro-card p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Generations</span>
            <Cpu className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-200">{generationsRun}</div>
          <span className="text-[11px] text-zinc-500 mt-1 block">100 Chromosomes</span>
        </div>

        {/* Metric 4: Heuristic vs GA Improvement */}
        <div className="pro-card p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">NN Baseline</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-200">{heuristicDistance} <span className="text-xs font-sans font-normal text-zinc-400">km</span></div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            {improvementPercentage}% optimization over greedy
          </span>
        </div>
      </div>

      {/* Ordered Route Sequence */}
      <div className="pro-card p-6 rounded-2xl border border-zinc-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4 text-sky-400" />
          Optimal Travel Path Sequence ({completePath.length - 1} Legs)
        </h4>

        <div className="flex flex-wrap items-center gap-2">
          {completePath.map((loc, idx) => {
            const isStart = idx === 0 || idx === completePath.length - 1;

            return (
              <React.Fragment key={`${loc.id}-${idx}`}>
                <div
                  className={`px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                    isStart
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-100 font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-mono flex items-center justify-center ${
                      isStart ? 'bg-sky-500 text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {idx === 0 ? 'S' : idx === completePath.length - 1 ? 'E' : idx}
                  </span>
                  <span className="text-xs font-medium">{loc.name}</span>
                </div>

                {idx < completePath.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
