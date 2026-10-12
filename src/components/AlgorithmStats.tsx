'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { GAResult } from '@/types/route';

interface AlgorithmStatsProps {
  result: GAResult;
}

export const AlgorithmStats: React.FC<AlgorithmStatsProps> = ({ result }) => {
  const { fitnessHistory, config, chromosomeCount } = result;

  if (!fitnessHistory || fitnessHistory.length === 0) return null;

  const width = 600;
  const height = 220;
  const padding = 35;

  const minDistance = Math.min(...fitnessHistory.map(h => h.bestDistance));
  const maxDistance = Math.max(...fitnessHistory.map(h => h.bestDistance));
  const distanceRange = maxDistance - minDistance || 1;

  const points = fitnessHistory.map((stat, idx) => {
    const x = padding + (idx / (fitnessHistory.length - 1)) * (width - 2 * padding);
    const normalized = (stat.bestDistance - minDistance) / distanceRange;
    const y = padding + normalized * (height - 2 * padding);
    return { x, y, stat };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, '');

  const fillD = `${pathD} L ${(width - padding).toFixed(1)} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="pro-card p-6 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pink-100">
        <div>
          <h3 className="text-sm font-pixel font-bold uppercase tracking-wider text-pink-950 flex items-center gap-2">
            <Activity className="w-4 h-4 text-pink-500" />
            Genetic Convergence & Distance Reduction Curve
          </h3>
          <p className="text-xs text-pink-700/80 mt-0.5 font-sans">
            Tracks total route distance reduction across {fitnessHistory.length} generations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-pixel text-pink-700">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block shadow-sm" />
          <span>Best Route Distance per Generation (km)</span>
        </div>
      </div>

      {/* SVG Convergence Chart */}
      <div className="relative w-full aspect-[21/9] bg-pink-50/40 rounded-xl border-2 border-pink-200 p-2 overflow-hidden shadow-inner">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <linearGradient id="pinkChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F472B6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F472B6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#FBCFE8" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#FBCFE8" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#FBCFE8" />

          {/* Area Fill */}
          <path d={fillD} fill="url(#pinkChartGradient)" />

          {/* Convergence Line */}
          <path d={pathD} fill="none" stroke="#DB2777" strokeWidth="2.5" strokeLinecap="round" />

          {/* Start Point Marker */}
          {points[0] && (
            <circle cx={points[0].x} cy={points[0].y} r="4.5" fill="#BE185D" stroke="#FFFFFF" strokeWidth="1.5" />
          )}

          {/* End Point Marker */}
          {points[points.length - 1] && (
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
          )}

          {/* Axis Labels */}
          <text x={padding} y={height - 10} fill="#9D174D" fontSize="10" fontFamily="Pixelify Sans">Gen 1</text>
          <text x={width / 2} y={height - 10} fill="#9D174D" fontSize="10" fontFamily="Pixelify Sans" textAnchor="middle">
            Gen {Math.round(fitnessHistory.length / 2)}
          </text>
          <text x={width - padding} y={height - 10} fill="#9D174D" fontSize="10" fontFamily="Pixelify Sans" textAnchor="end">
            Gen {fitnessHistory.length}
          </text>
        </svg>
      </div>

      {/* GA Hyperparameter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-pink-50/70 p-3.5 rounded-xl border-2 border-pink-200 shadow-[2px_2px_0px_#FBCFE8]">
          <div className="text-[10px] uppercase font-pixel font-bold text-pink-700">Population Size</div>
          <div className="text-base font-pixel font-bold text-pink-950 mt-0.5">{chromosomeCount}</div>
          <div className="text-[10px] text-zinc-500 font-sans mt-0.5">Chromosomes</div>
        </div>

        <div className="bg-pink-50/70 p-3.5 rounded-xl border-2 border-pink-200 shadow-[2px_2px_0px_#FBCFE8]">
          <div className="text-[10px] uppercase font-pixel font-bold text-pink-700">Selection Strategy</div>
          <div className="text-base font-pixel font-bold text-pink-600 mt-0.5">Tournament</div>
          <div className="text-[10px] text-zinc-500 font-sans mt-0.5">Size k = {config.tournamentSize}</div>
        </div>

        <div className="bg-pink-50/70 p-3.5 rounded-xl border-2 border-pink-200 shadow-[2px_2px_0px_#FBCFE8]">
          <div className="text-[10px] uppercase font-pixel font-bold text-pink-700">Crossover Operator</div>
          <div className="text-base font-pixel font-bold text-emerald-700 mt-0.5">Ordered (OX)</div>
          <div className="text-[10px] text-zinc-500 font-sans mt-0.5">Preserves permutation</div>
        </div>

        <div className="bg-pink-50/70 p-3.5 rounded-xl border-2 border-pink-200 shadow-[2px_2px_0px_#FBCFE8]">
          <div className="text-[10px] uppercase font-pixel font-bold text-pink-700">Mutation & Elitism</div>
          <div className="text-base font-pixel font-bold text-pink-800 mt-0.5">
            {config.mutationRate * 100}% | Top {config.eliteCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-sans mt-0.5">Swap operator</div>
        </div>
      </div>
    </div>
  );
};
