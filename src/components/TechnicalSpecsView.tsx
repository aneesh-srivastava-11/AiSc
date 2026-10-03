'use client';

import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp, Code, Layers, Sliders, ShieldCheck } from 'lucide-react';

interface TechSpec {
  title: string;
  category: string;
  description: string;
  specs: string[];
}

const TECH_SPECS: TechSpec[] = [
  {
    title: "1. Evolutionary Algorithm Engine Architecture",
    category: "Algorithm Design",
    description: "Ai-ternary uses a hybrid Memetic Genetic Algorithm architecture that combines greedy local heuristic initialization with global stochastic evolutionary operators.",
    specs: [
      "Population Initialization: 100 Chromosomes (1 Seeded by Nearest Neighbor, 99 Random Permutations)",
      "Fitness Function: Inverse Total Haversine Distance (Fitness = 1 / Distance_km)",
      "Selection Protocol: Tournament Selection with size k = 5",
      "Genetic Recombination: Ordered Crossover (OX) preserving permutation validity",
      "Mutation Operator: Swap Mutation with 5% rate",
      "Elitism Preservation: Top 5 chromosomes bypass recombination directly into next generation"
    ]
  },
  {
    title: "2. Nearest Neighbor Heuristic Search Integration",
    category: "Heuristic Optimization",
    description: "Greedy heuristic search provides an initial baseline solution by iteratively selecting the closest unvisited node relative to the current position.",
    specs: [
      "Time Complexity: O(N^2) deterministic search",
      "Purpose: Seeds Chromosome 1 to accelerate convergence rate",
      "Geodesic Distance Metric: Real-world Haversine formula on Earth sphere",
      "Convergence Advantage: Reduces generation search iterations required for optimal route discovery"
    ]
  },
  {
    title: "3. Computational Complexity Comparison",
    category: "Performance Benchmarks",
    description: "Evaluation of search space exploration scale compared to exhaustive brute-force search.",
    specs: [
      "Brute Force Permutation Space: O(N!) factorial growth (e.g. 10! = 3,628,800 paths)",
      "Genetic Algorithm Complexity: O(g × p × N) linear time with respect to generations (g=100) and population (p=100)",
      "Execution Latency: Sub-second evaluation (<150ms in Node.js serverless handler)",
      "Scalability Target: Scalable to high node counts without exponential performance degradation"
    ]
  },
  {
    title: "4. Geocoding & OpenStreetMap Spatial Integration",
    category: "Spatial GIS",
    description: "Integrates OpenStreetMap Nominatim Geocoding API and Leaflet CartoDB Dark tile layers for real-world latitude/longitude routing.",
    specs: [
      "Geocoding API: OpenStreetMap Nominatim Search API",
      "Tile Renderer: Leaflet CartoDB Dark Matter tile layer",
      "Coordinates: Real latitude & longitude degrees",
      "Distance Formula: Haversine spherical distance formula"
    ]
  }
];

export const TechnicalSpecsView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">System Technical Specifications & AI Architecture</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Engine specifications, theoretical formulations, and computational complexity benchmarks.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {TECH_SPECS.map((spec, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-slate-950/90 border-cyan-500/40 shadow-md'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-slate-200 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-cyan-400 font-mono text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{spec.title}</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs space-y-3 border-t border-slate-800/60">
                  <p className="text-slate-300 leading-relaxed font-sans">{spec.description}</p>

                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Technical Specifications:</span>
                    <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
                      {spec.specs.map((item, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
