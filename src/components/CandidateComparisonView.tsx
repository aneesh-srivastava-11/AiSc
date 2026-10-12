'use client';

import React from 'react';
import { CheckCircle2, Trophy, ShieldCheck, Compass, Award } from 'lucide-react';
import { AlgorithmType, GAResult } from '@/types/route';

interface CandidateComparisonViewProps {
  result: GAResult;
  activeAlgorithmId?: string;
  onSelectAlgorithm?: (id: AlgorithmType) => void;
}

export const CandidateComparisonView: React.FC<CandidateComparisonViewProps> = ({
  result,
  activeAlgorithmId,
  onSelectAlgorithm
}) => {
  const { candidates, algorithmList, winningAlgorithmId } = result;

  if (!candidates || candidates.length === 0) return null;

  const winningDistance = result.totalDistance;

  return (
    <div className="pro-card p-6 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-100">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-pink-500" />
            <h3 className="text-base font-pixel font-bold text-pink-950">
              Multi-Algorithm Benchmark Arena & Decision Engine
            </h3>
          </div>
          <p className="text-xs text-pink-800/80 mt-1 font-sans">
            Comparative performance across Informed (A*), Evolutionary (GA), Greedy (Nearest Neighbor), and Uninformed (BFS, DFS) search paradigms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-pixel bg-pink-100 border-2 border-pink-300 text-pink-900 shadow-[2px_2px_0px_#F472B6]">
            Winner: <strong className="text-pink-600">{winningAlgorithmId?.toUpperCase() || 'OPTIMAL'}</strong>
          </span>
        </div>
      </div>

      {/* Importance & Weighting Explanation Banner */}
      <div className="p-4 rounded-xl bg-pink-50 border-2 border-pink-200 space-y-2 text-xs shadow-[2px_2px_0px_#FBCFE8]">
        <h4 className="font-pixel font-bold text-pink-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-pink-600" />
          Evaluation Criteria & Theoretical Guarantees
        </h4>
        <p className="text-zinc-600 leading-relaxed font-sans">
          The engine benchmarks algorithms across three dimensions: <strong>Distance Minimization (Primary Criterion)</strong>, <strong>Optimality Guarantee</strong> (Admissible heuristics guarantee true global minimum), and <strong>Computational Complexity</strong> (balancing execution time vs search space coverage). Click any algorithm card below to inspect its route directly on the map.
        </p>
      </div>

      {/* Algorithm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {(algorithmList || []).map((algo) => {
          const isWinner = algo.isSelectedBest;
          const isCurrentlyActive = activeAlgorithmId === algo.id;
          const diffFromBest = Number((algo.totalDistance - winningDistance).toFixed(2));

          return (
            <div
              key={algo.id}
              onClick={() => onSelectAlgorithm && onSelectAlgorithm(algo.id)}
              className={`p-4 rounded-xl border-2 flex flex-col justify-between transition-all cursor-pointer ${
                isCurrentlyActive
                  ? 'bg-pink-100/90 border-pink-500 shadow-[4px_4px_0px_#DB2777]'
                  : isWinner
                  ? 'bg-emerald-50/90 border-emerald-400 shadow-[3px_3px_0px_#10B981] hover:border-emerald-500'
                  : 'bg-white border-pink-200 shadow-[3px_3px_0px_#FBCFE8] hover:border-pink-300 hover:bg-pink-50/40'
              }`}
            >
              <div>
                {/* Header / Badges */}
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shadow-sm"
                    style={{ backgroundColor: algo.color }}
                    title={algo.name}
                  />
                  {isWinner ? (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-pixel font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Best Route
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-mono text-pink-700 bg-pink-50 border border-pink-200">
                      +{diffFromBest} km
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-pixel font-bold text-pink-950 truncate">{algo.name}</h4>
                </div>
                <span className="text-[10px] text-pink-600 font-pixel block mt-0.5">
                  {algo.shortName} • {algo.category.split(' ')[0]}
                </span>

                <p className="text-[10px] text-zinc-600 leading-relaxed mt-2 line-clamp-3 font-sans">
                  {algo.explanation}
                </p>
              </div>

              {/* Metrics */}
              <div className="pt-3 mt-3 border-t border-pink-100 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-zinc-700">
                  <span className="text-[10px] font-pixel text-pink-700">Distance:</span>
                  <span className={`font-bold ${isWinner ? 'text-emerald-700' : 'text-zinc-800'}`}>
                    {algo.totalDistance} km
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-700">
                  <span className="text-[10px] font-pixel text-pink-700">Time:</span>
                  <span className="text-zinc-600">{algo.executionTimeMs} ms</span>
                </div>

                <div className="flex items-center justify-between text-zinc-700">
                  <span className="text-[10px] font-pixel text-pink-700">Nodes/States:</span>
                  <span className="text-pink-600 font-bold">{algo.nodesExpanded}</span>
                </div>

                <div className="pt-1 text-[9px] font-pixel text-center">
                  <span className={`px-2 py-0.5 rounded-md border ${
                    algo.optimality.includes('Global')
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : algo.optimality.includes('Near')
                      ? 'bg-pink-100 text-pink-800 border-pink-300'
                      : algo.optimality.includes('Pruned')
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {algo.optimality}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Summary Matrix Table */}
      <div className="p-4 rounded-xl bg-white border-2 border-pink-200 overflow-x-auto shadow-[3px_3px_0px_#FBCFE8]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-pixel font-bold uppercase tracking-wider text-pink-950 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-pink-500" />
            Decision Selection Matrix & Complexity Comparison
          </h4>
          <span className="text-[11px] text-pink-600 font-pixel">Real-time Comparative Benchmarks</span>
        </div>

        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b-2 border-pink-100 text-pink-900 text-[11px] font-pixel uppercase bg-pink-50/60">
              <th className="py-2.5 px-2">Algorithm</th>
              <th className="py-2.5 px-2">Category</th>
              <th className="py-2.5 px-2">Distance (km)</th>
              <th className="py-2.5 px-2">Nodes Explored</th>
              <th className="py-2.5 px-2">Latency</th>
              <th className="py-2.5 px-2">Time Complexity</th>
              <th className="py-2.5 px-2">Optimality Guarantee</th>
              <th className="py-2.5 px-2 text-right">Map View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-100 text-zinc-700 text-[11px]">
            {(algorithmList || []).map((cand) => {
              const isWinner = cand.isSelectedBest;
              const isSelected = activeAlgorithmId === cand.id;

              return (
                <tr
                  key={cand.id}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-pink-100/60'
                      : isWinner
                      ? 'bg-emerald-50/50 font-semibold'
                      : 'hover:bg-pink-50/40'
                  }`}
                >
                  <td className="py-2.5 px-2 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: cand.color }}
                    />
                    <span className="font-bold text-pink-950 font-pixel">{cand.name}</span>
                  </td>
                  <td className="py-2.5 px-2 text-zinc-600 font-sans">{cand.category}</td>
                  <td className="py-2.5 px-2 font-mono">
                    <span className={isWinner ? 'text-emerald-700 font-bold' : 'text-zinc-800'}>
                      {cand.totalDistance} km
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-zinc-600">{cand.nodesExpanded}</td>
                  <td className="py-2.5 px-2 font-mono text-zinc-600">{cand.executionTimeMs} ms</td>
                  <td className="py-2.5 px-2 font-mono text-zinc-600 text-[10px]">{cand.timeComplexity}</td>
                  <td className="py-2.5 px-2 font-pixel">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      cand.optimality.includes('Global')
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : cand.optimality.includes('Near')
                        ? 'bg-pink-100 text-pink-800 border border-pink-300'
                        : cand.optimality.includes('Pruned')
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {cand.optimality}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectAlgorithm && onSelectAlgorithm(cand.id)}
                      className={`px-3 py-1 rounded-md text-[10px] font-pixel transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-pink-500 text-white font-bold shadow-[2px_2px_0px_#9D174D]'
                          : 'pixel-btn text-pink-700 bg-pink-50 border border-pink-300'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Preview'}
                    </button>
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
