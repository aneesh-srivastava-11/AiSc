'use client';

import React, { useState } from 'react';
import { Eye, Layers, MapPin, Navigation } from 'lucide-react';
import { GAResult, Location } from '@/types/route';
import { euclideanDistance } from '@/lib/distance';

interface RouteGraphProps {
  result: GAResult;
  allLocations: Location[];
}

export const RouteGraph: React.FC<RouteGraphProps> = ({ result, allLocations }) => {
  const [showAllEdges, setShowAllEdges] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<Location | null>(null);

  const { startLocation, bestRoute } = result;
  const routeSequence = [startLocation, ...bestRoute, startLocation];

  // Helper to get coordinates scaled to SVG viewBox 0..600 0..400
  const scale = (val: number, isY = false) => {
    // val is 0..100
    if (isY) {
      return 40 + (val / 100) * 320; // 40..360
    }
    return 50 + (val / 100) * 500; // 50..550
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-400" />
            2D Spatial Route Visualization (SVG Canvas)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Nodes represent travel destinations; edges depict Euclidean paths optimized by Genetic Algorithm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAllEdges(!showAllEdges)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
              showAllEdges
                ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {showAllEdges ? 'Showing Mesh Edges' : 'Show Complete Graph Mesh'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full aspect-[16/10] bg-slate-950/90 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center shadow-inner">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(#475569 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <svg viewBox="0 0 600 400" className="w-full h-full">
          <defs>
            {/* Arrowhead marker for route path */}
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="14"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#6366F1" />
            </marker>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Optional All-Edges Mesh Background */}
          {showAllEdges &&
            allLocations.map((loc1, i) =>
              allLocations.slice(i + 1).map((loc2, j) => (
                <line
                  key={`mesh-${i}-${j}`}
                  x1={scale(loc1.x)}
                  y1={scale(loc1.y, true)}
                  x2={scale(loc2.x)}
                  y2={scale(loc2.y, true)}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.3"
                />
              ))
            )}

          {/* 2. Optimized GA Route Line Edges */}
          {routeSequence.map((loc, idx) => {
            if (idx === routeSequence.length - 1) return null;
            const nextLoc = routeSequence[idx + 1];

            const x1 = scale(loc.x);
            const y1 = scale(loc.y, true);
            const x2 = scale(nextLoc.x);
            const y2 = scale(nextLoc.y, true);

            const legDist = euclideanDistance(loc, nextLoc).toFixed(1);
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={`leg-${idx}`}>
                {/* Glowing underline */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#818CF8"
                  strokeWidth="4"
                  opacity="0.25"
                  filter="url(#glow)"
                />

                {/* Animated direction line */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#6366F1"
                  strokeWidth="2.5"
                  markerEnd="url(#arrowhead)"
                  className="animate-dash-line"
                />

                {/* Distance Badge on Edge */}
                <rect
                  x={midX - 16}
                  y={midY - 10}
                  width="32"
                  height="18"
                  rx="6"
                  fill="#0F172A"
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x={midX}
                  y={midY + 3}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  fontWeight="600"
                >
                  {legDist}
                </text>
              </g>
            );
          })}

          {/* 3. Node Markers */}
          {allLocations.map((loc, idx) => {
            const isStart = loc.id === startLocation.id;
            const cx = scale(loc.x);
            const cy = scale(loc.y, true);
            const isHovered = hoveredNode?.id === loc.id;

            return (
              <g
                key={loc.id}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredNode(loc)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Pulse ring for start node */}
                {isStart && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="18"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-pulse-glow"
                  />
                )}

                {/* Outer Glow Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 14 : 11}
                  fill={isStart ? '#10B981' : '#6366F1'}
                  opacity={isHovered ? 1 : 0.9}
                  filter="url(#glow)"
                />

                {/* Inner Core */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 5}
                  fill="#FFFFFF"
                />

                {/* Node Label Text */}
                <text
                  x={cx}
                  y={cy - 16}
                  textAnchor="middle"
                  fill={isStart ? '#6EE7B7' : '#F1F5F9'}
                  fontSize="11"
                  fontWeight={isStart ? '700' : '600'}
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                >
                  {loc.name} {isStart ? '(Start)' : ''}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip if Node Hovered */}
        {hoveredNode && (
          <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-lg shadow-xl text-xs backdrop-blur-md">
            <div className="font-semibold text-slate-100 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              {hoveredNode.name}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Coordinates: ({hoveredNode.x}, {hoveredNode.y})
            </div>
          </div>
        )}
      </div>

      {/* Graph Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50" />
            <span>Origin (Start Node)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block shadow-sm shadow-indigo-500/50" />
            <span>Destination Nodes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-indigo-500 inline-block" />
            <span>Optimized Route Traversal</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-500">Euclidean Canvas: 600x400</span>
      </div>
    </div>
  );
};
