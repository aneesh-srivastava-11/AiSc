'use client';

import React from 'react';
import { Activity, Cpu } from 'lucide-react';
import { GAResult } from '@/types/route';

interface AlgorithmStatsProps {
  result: GAResult;
}

export const AlgorithmStats: React.FC<AlgorithmStatsProps> = ({ result }) => {
  const { fitnessHistory, config, chromosomeCount } = result;

  if (!fitnessHistory || fitnessHistory.length === 0) return null;

  // Compute SVG dimensions & scaling
  const width = 600;
  const height = 220;
  const padding = 35;

  const minDistance = Math.min(...fitnessHistory.map(h => h.bestDistance));
  const maxDistance = Math.max(...fitnessHistory.map(h => h.bestDistance));
  const distanceRange = maxDistance - minDistance || 1;

  const points = fitnessHistory.map((stat, idx) => {
    const x = padding + (idx / (fitnessHistory.length - 1)) * (width - 2 * padding);
    // Lower distance is better (top of chart)
    const normalized = (stat.bestDistance - minDistance) / distanceRange;
    const y = padding + normalized * (height - 2 * padding);
    return { x, y, stat };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, '');

  // Fill area under line
  const fillD = `${pathD} L ${(width - padding).toFixed(1)} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Genetic Convergence & Distance Reduction Curve
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracks total route distance reduction across {fitnessHistory.length} generations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
          <span>Best Route Distance per Generation (km)</span>
        </div>
      </div>

      {/* SVG Convergence Chart */}
      <div className="relative w-full aspect-[21/9] bg-slate-950/80 rounded-xl border border-slate-800/80 p-2 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1E293B" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1E293B" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1E293B" />

          {/* Area Fill */}
          <path d={fillD} fill="url(#chartGradient)" />

          {/* Convergence Line */}
          <path d={pathD} fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />

          {/* Start Point Marker */}
          {points[0] && (
            <circle cx={points[0].x} cy={points[0].y} r="4" fill="#F43F5E" />
          )}

          {/* End Point Marker */}
          {points[points.length - 1] && (
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill="#10B981" />
          )}

          {/* Axis Labels */}
          <text x={padding} y={height - 10} fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">Gen 1</text>
          <text x={width / 2} y={height - 10} fill="#64748B" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
            Gen {Math.round(fitnessHistory.length / 2)}
          </text>
          <text x={width - padding} y={height - 10} fill="#64748B" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">
            Gen {fitnessHistory.length}
          </text>
        </svg>
      </div>

      {/* GA Hyperparameter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Population Size</div>
          <div className="text-base font-mono font-bold text-slate-100 mt-0.5">{chromosomeCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Chromosomes</div>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Selection Strategy</div>
          <div className="text-base font-mono font-bold text-cyan-400 mt-0.5">Tournament</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Size k = {config.tournamentSize}</div>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Crossover Operator</div>
          <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">Ordered (OX)</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Preserves permutation</div>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Mutation & Elitism</div>
          <div className="text-base font-mono font-bold text-sky-400 mt-0.5">
            {config.mutationRate * 100}% | Top {config.eliteCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Swap operator</div>
        </div>
      </div>
    </div>
  );
};
