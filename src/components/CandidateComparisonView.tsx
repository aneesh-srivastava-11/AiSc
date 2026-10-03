'use client';

import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Compass, Trophy } from 'lucide-react';
import { GAResult } from '@/types/route';

interface CandidateComparisonViewProps {
  result: GAResult;
}

export const CandidateComparisonView: React.FC<CandidateComparisonViewProps> = ({ result }) => {
  const { candidates } = result;

  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="pro-card p-6 rounded-2xl border border-zinc-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-zinc-100">Candidate Route Evaluation & Selection Engine</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            How importance was weighted across 3 candidate travel path outputs to select the optimal route for your itinerary.
          </p>
        </div>
      </div>

      {/* Importance & Weighting Explanation Banner */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
        <h4 className="font-bold text-zinc-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          Evaluation Criteria & Weighting Methodology
        </h4>
        <p className="text-zinc-400 leading-relaxed">
          The engine assigns importance primarily to <strong>Distance Minimization (80% Weight)</strong> via the fitness formulation <code>Fitness = 1 / Distance_km</code>, combined with <strong>Spatial Traversal Efficiency (20% Weight)</strong> to eliminate route crisscrossing. Out of 3 candidate path strategies evaluated, Candidate C (Genetic Algorithm) was selected as the optimal path.
        </p>
      </div>

      {/* 3 Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidates.map((cand) => {
          const isWinner = cand.isSelectedBest;

          return (
            <div
              key={cand.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isWinner
                  ? 'bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                  : 'bg-zinc-950/60 border-zinc-800 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                {/* Winner / Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase font-bold text-zinc-400">
                    {cand.strategy}
                  </span>
                  {isWinner ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selected Best
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 text-zinc-500 border border-zinc-800 flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-zinc-600" /> Suboptimal
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-zinc-100 mb-1">{cand.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
                  {cand.explanation}
                </p>
              </div>

              {/* Candidate Path Metrics */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-[11px] font-sans text-zinc-500">Total Distance:</span>
                  <span className={`font-bold ${isWinner ? 'text-emerald-400' : 'text-zinc-300'}`}>
                    {cand.totalDistance} km
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-[11px] font-sans text-zinc-500">Fitness Score:</span>
                  <span className={`font-bold ${isWinner ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    {cand.fitnessScore}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Summary Matrix */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 overflow-x-auto">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-sky-400" />
          Decision Selection Matrix
        </h4>

        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 text-[11px] uppercase">
              <th className="pb-2">Candidate Output</th>
              <th className="pb-2">Distance (km)</th>
              <th className="pb-2">Fitness Score</th>
              <th className="pb-2">Evaluation Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {candidates.map((cand) => (
              <tr key={cand.id} className={cand.isSelectedBest ? 'bg-zinc-900/40 font-semibold' : ''}>
                <td className="py-2.5 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cand.isSelectedBest ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                  <span>{cand.title}</span>
                </td>
                <td className="py-2.5 font-mono">{cand.totalDistance} km</td>
                <td className="py-2.5 font-mono">{cand.fitnessScore}</td>
                <td className="py-2.5">
                  {cand.isSelectedBest ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Chosen as Optimal Route
                    </span>
                  ) : (
                    <span className="text-zinc-500">Higher Cost (Rejected)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
