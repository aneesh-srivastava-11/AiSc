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

  const scale = (val: number, isY = false) => {
    if (isY) {
      return 40 + (val / 100) * 320;
    }
    return 50 + (val / 100) * 500;
  };

  return (
    <div className="pro-card p-6 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pink-100">
        <div>
          <h3 className="text-sm font-pixel font-bold uppercase tracking-wider text-pink-950 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-pink-500" />
            2D Spatial Route Visualization (SVG Canvas)
          </h3>
          <p className="text-xs text-pink-700/80 mt-0.5 font-sans">
            Nodes represent travel destinations; edges depict Euclidean paths optimized by AI search algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAllEdges(!showAllEdges)}
            className={`px-3 py-1.5 rounded-lg text-xs font-pixel border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              showAllEdges
                ? 'bg-pink-500 border-pink-600 text-white shadow-[2px_2px_0px_#9D174D]'
                : 'pixel-btn text-pink-700 bg-pink-50 border-pink-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {showAllEdges ? 'Showing Mesh Edges' : 'Show Complete Graph Mesh'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full aspect-[16/10] bg-pink-50/50 rounded-xl border-2 border-pink-200 overflow-hidden flex items-center justify-center shadow-inner">
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(#FBCFE8 1.5px, transparent 1.5px)`,
            backgroundSize: '20px 20px'
          }}
        />

        <svg viewBox="0 0 600 400" className="w-full h-full">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="14"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#EC4899" />
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
                  stroke="#FBCFE8"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
              ))
            )}

          {/* 2. Optimized Route Line Edges */}
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
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#F472B6"
                  strokeWidth="5"
                  opacity="0.4"
                  filter="url(#glow)"
                />

                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#EC4899"
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
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#F472B6"
                  strokeWidth="1"
                />
                <text
                  x={midX}
                  y={midY + 3}
                  textAnchor="middle"
                  fill="#BE185D"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  fontWeight="700"
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
                {isStart && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="18"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 14 : 11}
                  fill={isStart ? '#EC4899' : '#F472B6'}
                  opacity={isHovered ? 1 : 0.95}
                  filter="url(#glow)"
                />

                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 5}
                  fill="#FFFFFF"
                />

                <text
                  x={cx}
                  y={cy - 16}
                  textAnchor="middle"
                  fill="#831843"
                  fontSize="11"
                  fontFamily="Pixelify Sans"
                  fontWeight={isStart ? '700' : '600'}
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
                >
                  {loc.name} {isStart ? '(Start)' : ''}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredNode && (
          <div className="absolute bottom-3 left-3 bg-white border-2 border-pink-300 px-3.5 py-2 rounded-xl shadow-[3px_3px_0px_#F472B6] text-xs">
            <div className="font-pixel font-bold text-pink-950 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pink-500" />
              {hoveredNode.name}
            </div>
            <div className="text-[11px] text-pink-600 font-mono mt-0.5">
              Coordinates: ({hoveredNode.x}, {hoveredNode.y})
            </div>
          </div>
        )}
      </div>

      {/* Graph Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-pink-700 font-pixel pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-pink-600 inline-block shadow-sm" />
            <span>Origin (Start Node)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-pink-400 inline-block shadow-sm" />
            <span>Destination Nodes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1 bg-pink-500 inline-block rounded" />
            <span>Optimized Route Traversal</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-pink-400">Euclidean Canvas: 600x400</span>
      </div>
    </div>
  );
};
