'use client';

import React from 'react';
import { Compass, Zap, ArrowRight, CheckCircle2, TrendingUp, Cpu, Award } from 'lucide-react';
import { AlgorithmType, GAResult } from '@/types/route';

interface RouteResultProps {
  result: GAResult;
  activeAlgorithmId?: string;
  onSelectAlgorithm?: (id: AlgorithmType) => void;
}

export const RouteResult: React.FC<RouteResultProps> = ({
  result,
  activeAlgorithmId = 'astar',
  onSelectAlgorithm
}) => {
  const {
    startLocation,
    algorithms,
    algorithmList,
    heuristicDistance
  } = result;

  // Retrieve data for the currently active algorithm
  const currentAlgo = algorithms ? algorithms[activeAlgorithmId as AlgorithmType] : null;

  const activeRoute = currentAlgo ? currentAlgo.route : result.bestRoute;
  const activeDistance = currentAlgo ? currentAlgo.totalDistance : result.totalDistance;
  const activeFitness = currentAlgo ? currentAlgo.fitnessScore : result.fitnessScore;
  const activeTime = currentAlgo ? currentAlgo.executionTimeMs : result.executionTimeMs;
  const activeNodes = currentAlgo ? currentAlgo.nodesExpanded : 100;
  const activeOptimality = currentAlgo ? currentAlgo.optimality : 'Optimal';
  const isWinning = currentAlgo ? currentAlgo.isSelectedBest : true;

  const completePath = [startLocation, ...activeRoute, startLocation];

  return (
    <div className="space-y-6">
      {/* Top Banner with Algorithm Switcher */}
      <div className="pro-card p-6 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-pink-600 shadow-[2px_2px_0px_#F472B6]">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-pixel font-bold text-pink-950">
                  {currentAlgo ? currentAlgo.name : 'Optimized Travel Route'}
                </h3>
                {isWinning ? (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-pixel font-semibold bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center gap-1 shadow-[2px_2px_0px_#10B981]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selected Best (Lowest Cost)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-pixel font-semibold bg-pink-50 text-pink-700 border-2 border-pink-200 flex items-center gap-1 shadow-[2px_2px_0px_#FBCFE8]">
                    Comparative Route
                  </span>
                )}
              </div>
              <p className="text-xs text-pink-800/80 mt-1 font-sans">
                {currentAlgo ? currentAlgo.explanation : 'Calculated using AI Search and OpenStreetMap GIS Geocoding'}
              </p>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-pink-50 border-2 border-pink-200 text-right self-start md:self-auto font-mono shadow-[2px_2px_0px_#FBCFE8]">
            <div className="text-[10px] text-pink-600 uppercase font-pixel font-semibold">Latency</div>
            <div className="text-xs font-bold text-pink-950">{activeTime} ms</div>
          </div>
        </div>

        {/* Algorithm Quick Selector Tabs */}
        {algorithmList && algorithmList.length > 0 && (
          <div className="pt-3 border-t border-pink-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-pink-800 font-pixel font-semibold mr-1">Switch Route:</span>
            {algorithmList.map((algo) => {
              const isActive = activeAlgorithmId === algo.id;
              return (
                <button
                  key={algo.id}
                  type="button"
                  onClick={() => onSelectAlgorithm && onSelectAlgorithm(algo.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-pixel font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-pink-100 border-2 border-pink-500 text-pink-950 shadow-[3px_3px_0px_#DB2777]'
                      : 'bg-white border-2 border-pink-200 text-zinc-600 hover:border-pink-300 hover:bg-pink-50/50 shadow-[2px_2px_0px_#FBCFE8]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: algo.color }}
                  />
                  <span>{algo.shortName}</span>
                  <span className="font-mono text-[10px] opacity-80">{algo.totalDistance} km</span>
                  {algo.isSelectedBest && (
                    <Award className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Distance */}
        <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[3px_3px_0px_#F472B6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-pixel font-semibold text-pink-700 uppercase tracking-wider">Total Distance</span>
            <Compass className="w-4 h-4 text-pink-500" />
          </div>
          <div className="text-2xl font-black font-pixel text-pink-950">
            {activeDistance} <span className="text-xs font-sans font-normal text-pink-600">km</span>
          </div>
          <span className="text-[11px] text-pink-500 font-sans mt-1 block">Real Haversine Distance</span>
        </div>

        {/* Metric 2: Fitness Score */}
        <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[3px_3px_0px_#F472B6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-pixel font-semibold text-pink-700 uppercase tracking-wider">Fitness Score</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-pink-950">
            {typeof activeFitness === 'number' ? activeFitness.toFixed(5) : activeFitness}
          </div>
          <span className="text-[11px] text-pink-500 font-sans mt-1 block">Fitness = 1 / Distance_km</span>
        </div>

        {/* Metric 3: Search States Explored */}
        <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[3px_3px_0px_#F472B6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-pixel font-semibold text-pink-700 uppercase tracking-wider">Nodes / States</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black font-mono text-pink-950">{activeNodes}</div>
          <span className="text-[11px] text-pink-500 font-sans mt-1 block">State Space Expansions</span>
        </div>

        {/* Metric 4: Optimality Guarantee & Benchmark */}
        <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[3px_3px_0px_#F472B6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-pixel font-semibold text-pink-700 uppercase tracking-wider">Optimality</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-sm font-bold font-pixel text-pink-950 truncate">{activeOptimality}</div>
          <span className="text-[11px] text-emerald-700 font-pixel mt-1 block">
            {activeDistance <= heuristicDistance ? (
              `${(((heuristicDistance - activeDistance) / (heuristicDistance || 1)) * 100).toFixed(1)}% gain over greedy`
            ) : (
              `Baseline nearest neighbor`
            )}
          </span>
        </div>
      </div>

      {/* Ordered Route Sequence */}
      <div className="pro-card p-6 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6]">
        <h4 className="text-xs font-pixel font-bold uppercase tracking-wider text-pink-950 mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4 text-pink-500" />
          {currentAlgo?.shortName || 'Optimal'} Path Sequence ({completePath.length - 1} Legs)
        </h4>

        <div className="flex flex-wrap items-center gap-2">
          {completePath.map((loc, idx) => {
            const isStart = idx === 0 || idx === completePath.length - 1;

            return (
              <React.Fragment key={`${loc.id}-${idx}`}>
                <div
                  className={`px-3.5 py-2 rounded-xl border-2 flex items-center gap-2.5 transition-all ${
                    isStart
                      ? 'bg-pink-100 border-pink-400 text-pink-950 font-bold shadow-[2px_2px_0px_#F472B6]'
                      : 'bg-white border-pink-200 text-zinc-700 shadow-[2px_2px_0px_#FBCFE8]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md text-[11px] font-pixel flex items-center justify-center ${
                      isStart ? 'bg-pink-500 text-white font-bold' : 'bg-pink-50 text-pink-700 border border-pink-200'
                    }`}
                  >
                    {idx === 0 ? 'S' : idx === completePath.length - 1 ? 'E' : idx}
                  </span>
                  <span className="text-xs font-sans font-medium">{loc.name}</span>
                </div>

                {idx < completePath.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-pink-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
