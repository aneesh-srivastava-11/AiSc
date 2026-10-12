'use client';

import React from 'react';
import { FileText, Cpu, GitBranch, Target, CheckCircle, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="pro-card p-6 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-pink-100">
        <div className="w-11 h-11 rounded-xl bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-pink-600 shadow-[2px_2px_0px_#F472B6]">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-pixel font-bold text-pink-950">Project Academic Documentation & Specification</h3>
          <p className="text-xs text-pink-700/80 mt-0.5 font-sans">
            Standard college report format and architectural specification for course evaluation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Section 1: Problem Statement */}
        <div className="p-4 rounded-xl bg-pink-50/60 border-2 border-pink-200 space-y-2 shadow-[2px_2px_0px_#FBCFE8]">
          <div className="flex items-center gap-2 text-pink-900 font-pixel font-bold uppercase text-[11px] tracking-wider">
            <Target className="w-3.5 h-3.5 text-pink-500" /> 1. Problem Statement
          </div>
          <p className="text-zinc-700 leading-relaxed font-sans">
            Multi-destination travel itinerary planning requires discovering the shortest round-trip tour visiting a set of chosen attractions and returning to the origin. Formulated as the classic NP-Hard Traveling Salesperson Problem (TSP), the permutation search space expands factorially (N!). Brute-force verification becomes computationally intractable for even modest numbers of cities (N=15 is 1.3 trillion routes), demanding intelligent heuristic, branch-and-bound, and evolutionary search paradigms.
          </p>
        </div>

        {/* Section 2: Objectives */}
        <div className="p-4 rounded-xl bg-pink-50/60 border-2 border-pink-200 space-y-2 shadow-[2px_2px_0px_#FBCFE8]">
          <div className="flex items-center gap-2 text-emerald-900 font-pixel font-bold uppercase text-[11px] tracking-wider">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 2. Objectives & Deliverables
          </div>
          <ul className="text-zinc-700 space-y-1.5 list-disc pl-4 leading-relaxed font-sans">
            <li>Benchmark 5 classical AI search paradigms: A* (MST Heuristic), GA, Greedy, BFS, and DFS with Branch-and-Bound.</li>
            <li>Incorporate live OpenStreetMap (OSM) Nominatim geocoding and real-world geodesic Haversine distance calculations.</li>
            <li>Render an interactive Leaflet GIS map with multi-algorithm comparative path overlays.</li>
            <li>Adhere strictly to pure classical AI: zero neural networks, zero ML models, zero third-party AI APIs.</li>
          </ul>
        </div>

        {/* Section 3: AI Methodology */}
        <div className="p-4 rounded-xl bg-pink-50/60 border-2 border-pink-200 space-y-2 shadow-[2px_2px_0px_#FBCFE8]">
          <div className="flex items-center gap-2 text-purple-900 font-pixel font-bold uppercase text-[11px] tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-purple-600" /> 3. Algorithmic Methodology
          </div>
          <p className="text-zinc-700 leading-relaxed font-sans">
            <strong>Informed Search (A*):</strong> Implements <code>f(n) = g(n) + h(n)</code> where h(n) is an admissible Minimum Spanning Tree (MST) computed via Prim's algorithm in O(E log V).<br/>
            <strong>Metaheuristic Search (GA):</strong> Evolving 100 chromosomes over 100 generations with Tournament Selection (k=5), Ordered Crossover (OX), and Swap Mutation (5%).<br/>
            <strong>Uninformed Search (BFS & DFS):</strong> Explores tree permutations with Branch-and-Bound pruning to eliminate sub-branches exceeding best-known bounds.
          </p>
        </div>

        {/* Section 4: System Architecture */}
        <div className="p-4 rounded-xl bg-pink-50/60 border-2 border-pink-200 space-y-2 shadow-[2px_2px_0px_#FBCFE8]">
          <div className="flex items-center gap-2 text-pink-900 font-pixel font-bold uppercase text-[11px] tracking-wider">
            <GitBranch className="w-3.5 h-3.5 text-pink-600" /> 4. Software Architecture & Stack
          </div>
          <p className="text-zinc-700 leading-relaxed font-sans">
            Built as a modern, high-performance web application utilizing <strong>Next.js 16 App Router</strong> and <strong>TypeScript</strong>. The frontend features an interactive, soothing pixelated light pink & white UI. Optimization requests dispatch to <code>/api/optimize</code>, which computes geodesic distance matrices, executes benchmark engines, and returns complete algorithmic metrics to the client in under 50ms.
          </p>
        </div>
      </div>

      {/* SVG Flowchart Diagram */}
      <div className="p-5 rounded-xl bg-pink-50/40 border-2 border-pink-200 space-y-3 shadow-[2px_2px_0px_#FBCFE8]">
        <h4 className="text-xs font-pixel font-bold uppercase tracking-wider text-pink-950 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          5. Multi-Algorithm Search & Optimization Pipeline Architecture
        </h4>

        <div className="p-4 bg-white rounded-xl border-2 border-pink-200 flex justify-center shadow-inner">
          <svg viewBox="0 0 720 220" className="w-full max-w-3xl h-auto">
            <defs>
              <marker id="pinkArrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#EC4899" />
              </marker>
            </defs>

            {/* Box 1: Input & OSM Geocoding */}
            <rect x="15" y="80" width="120" height="60" rx="8" fill="#FFF0F5" stroke="#F472B6" strokeWidth="2" />
            <text x="75" y="105" textAnchor="middle" fill="#831843" fontSize="10" fontFamily="Pixelify Sans" fontWeight="bold">Input Locations</text>
            <text x="75" y="122" textAnchor="middle" fill="#9D174D" fontSize="9" fontFamily="Plus Jakarta Sans">OSM Geocoding</text>

            <line x1="135" y1="110" x2="165" y2="110" stroke="#EC4899" strokeWidth="2" markerEnd="url(#pinkArrow)" />

            {/* Box 2: Haversine Distance Matrix */}
            <rect x="165" y="80" width="125" height="60" rx="8" fill="#FFF0F5" stroke="#F472B6" strokeWidth="2" />
            <text x="227" y="105" textAnchor="middle" fill="#831843" fontSize="10" fontFamily="Pixelify Sans" fontWeight="bold">Distance Matrix</text>
            <text x="227" y="122" textAnchor="middle" fill="#9D174D" fontSize="9" fontFamily="Plus Jakarta Sans">Haversine (R=6371km)</text>

            <line x1="290" y1="110" x2="320" y2="110" stroke="#EC4899" strokeWidth="2" markerEnd="url(#pinkArrow)" />

            {/* Box 3: 5 Search Engines Arena */}
            <rect x="320" y="60" width="160" height="100" rx="8" fill="#FDF2F8" stroke="#DB2777" strokeWidth="2" />
            <text x="400" y="85" textAnchor="middle" fill="#9D174D" fontSize="11" fontFamily="Pixelify Sans" fontWeight="bold">5 AI Search Engines</text>
            <text x="400" y="102" textAnchor="middle" fill="#BE185D" fontSize="8" fontFamily="Plus Jakarta Sans">• A* (Admissible MST)</text>
            <text x="400" y="116" textAnchor="middle" fill="#BE185D" fontSize="8" fontFamily="Plus Jakarta Sans">• GA (100 Gen, OX, Elites)</text>
            <text x="400" y="130" textAnchor="middle" fill="#BE185D" fontSize="8" fontFamily="Plus Jakarta Sans">• Greedy Nearest Neighbor</text>
            <text x="400" y="144" textAnchor="middle" fill="#BE185D" fontSize="8" fontFamily="Plus Jakarta Sans">• BFS & DFS (Branch & Bound)</text>

            <line x1="480" y1="110" x2="510" y2="110" stroke="#EC4899" strokeWidth="2" markerEnd="url(#pinkArrow)" />

            {/* Box 4: Benchmark & Evaluation */}
            <rect x="510" y="80" width="105" height="60" rx="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />
            <text x="562" y="105" textAnchor="middle" fill="#065F46" fontSize="10" fontFamily="Pixelify Sans" fontWeight="bold">Benchmark Matrix</text>
            <text x="562" y="122" textAnchor="middle" fill="#047857" fontSize="9" fontFamily="Plus Jakarta Sans">Select Lowest Cost</text>

            <line x1="615" y1="110" x2="640" y2="110" stroke="#EC4899" strokeWidth="2" markerEnd="url(#pinkArrow)" />

            {/* Box 5: Leaflet GIS Map */}
            <rect x="640" y="80" width="70" height="60" rx="8" fill="#FFF0F5" stroke="#F472B6" strokeWidth="2" />
            <text x="675" y="105" textAnchor="middle" fill="#831843" fontSize="10" fontFamily="Pixelify Sans" fontWeight="bold">GIS Map</text>
            <text x="675" y="122" textAnchor="middle" fill="#9D174D" fontSize="9" fontFamily="Plus Jakarta Sans">Leaflet Route</text>
          </svg>
        </div>
      </div>

      {/* Compliance & Conclusion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-pink-50/60 border-2 border-pink-200 space-y-2 shadow-[2px_2px_0px_#FBCFE8]">
          <div className="text-pink-900 font-pixel font-bold uppercase text-[11px] tracking-wider">
            6. Technology Justification: Why What is Used
          </div>
          <p className="text-zinc-700 leading-relaxed font-sans">
            <strong>OpenStreetMap & Leaflet:</strong> Selected because they provide 100% open-source, keyless geospatial data without credit card quotas or vendor lock-in.<br/>
            <strong>Next.js App Router:</strong> Serverless architecture provides instant zero-cold-start API handling and full TypeScript end-to-end type safety.<br/>
            <strong>Classical Search Paradigms:</strong> Enables mathematically provable, deterministic, and explainable optimization.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-pink-50/60 border-2 border-pink-200 space-y-2 shadow-[2px_2px_0px_#FBCFE8]">
          <div className="text-emerald-900 font-pixel font-bold uppercase text-[11px] tracking-wider">
            7. Academic Conclusion
          </div>
          <p className="text-zinc-700 leading-relaxed font-sans">
            Ai-ternary rigorously demonstrates the capabilities and trade-offs of classical AI search algorithms on NP-Hard spatial problems. A* guarantees mathematical global optimality via an admissible MST relaxation, while the Genetic Algorithm achieves near-optimal itineraries in strictly linear asymptotic complexity O(g·p·N), outperforming the myopic local optimum traps of Greedy search.
          </p>
        </div>
      </div>
    </div>
  );
};
