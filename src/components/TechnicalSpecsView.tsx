'use client';

import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';

interface TechSpec {
  title: string;
  category: string;
  description: string;
  specs: string[];
}

const TECH_SPECS: TechSpec[] = [
  {
    title: "1. A* Search Engine with Admissible MST Heuristic",
    category: "Informed Heuristic Search",
    description: "Optimal informed search engine utilizing evaluation function f(n) = g(n) + h(n) with a provably admissible Minimum Spanning Tree (MST) relaxation heuristic.",
    specs: [
      "Evaluation Function: f(n) = g(n) + h(n)",
      "Admissible Heuristic: MST(Unvisited) + min(dist(current, u)) + min(dist(u, start))",
      "MST Algorithm: Prim's algorithm in O(E log V) over geodesic Haversine distance matrix",
      "Data Structure: Binary Min-Heap Priority Queue ordered by f(n)",
      "Optimality Proof: Guaranteed discovery of mathematically shortest TSP tour"
    ]
  },
  {
    title: "2. Evolutionary Algorithm Engine (Genetic Algorithm)",
    category: "Metaheuristic Optimization",
    description: "Hybrid Memetic Genetic Algorithm architecture that combines stochastic evolutionary operators with greedy initialization to find global near-optimal tours.",
    specs: [
      "Population Initialization: 100 Chromosomes (Seeded with Greedy heuristic + Random permutations)",
      "Fitness Formulation: Fitness = 1 / Total Haversine Distance (km)",
      "Selection Protocol: Tournament Selection with tournament size k = 5",
      "Genetic Recombination: Ordered Crossover (OX) preserving permutation integrity",
      "Mutation Operator: Swap Mutation with 5% probability",
      "Elitism Preservation: Top 5 chromosomes bypass recombination directly into next generation"
    ]
  },
  {
    title: "3. Breadth-First & Depth-First Search with Branch-and-Bound",
    category: "Uninformed Search with B&B",
    description: "Level-by-level (BFS) and deep recursive (DFS) state space exploration enhanced with dynamic Branch-and-Bound pruning.",
    specs: [
      "BFS Exploration: Level-by-level traversal using FIFO Queue",
      "DFS Exploration: Deep branch exploration using LIFO Call Stack with backtracking",
      "Branch Ordering: Nearest-first heuristic sorting to rapidly tighten the upper bound in DFS",
      "Pruning Criterion: Immediate branch abandonment when g(n) >= bestDistance",
      "Memory Efficiency: DFS operates in linear space O(N) while BFS uses level queue"
    ]
  },
  {
    title: "4. Greedy Search (Nearest Neighbor Heuristic)",
    category: "Greedy Heuristic",
    description: "Deterministic local heuristic search iteratively selecting the closest unvisited node relative to the current position.",
    specs: [
      "Time Complexity: O(N^2) deterministic search",
      "Purpose: Rapid baseline calculation and upper bound seeding for Branch-and-Bound",
      "Distance Metric: Haversine geodesic distance on Earth's sphere",
      "Limitation: Prone to local minima traps near tour completion"
    ]
  },
  {
    title: "5. Computational Complexity Comparison & Big-O Summary",
    category: "Algorithm Performance",
    description: "Comparative theoretical analysis across all search paradigms on Traveling Salesperson state space.",
    specs: [
      "Brute Force Permutation Space: O(N!) factorial growth (10! = 3,628,800 paths)",
      "A* Search: O(b^d) guided by admissible MST heuristic pruning",
      "Genetic Algorithm: O(g × p × N) linear in generations (g=100) and population (p=100)",
      "Greedy Search: O(N^2) quadratic step-scan",
      "BFS / DFS with Branch-and-Bound: Worst-case O(N!), pruned to sub-second in practice"
    ]
  },
  {
    title: "6. Geocoding & OpenStreetMap GIS Integration",
    category: "Spatial GIS",
    description: "Integrates OpenStreetMap Nominatim Geocoding API and Leaflet Voyager light tile layers for real-world latitude/longitude routing.",
    specs: [
      "Geocoding API: OpenStreetMap Nominatim Search API with server-side proxy caching",
      "Tile Provider: Keyless CartoDB Voyager / Positron Canvas",
      "Coordinates: Real latitude & longitude degrees",
      "Distance Formula: Haversine spherical geodesic formula (Earth radius R = 6371 km)"
    ]
  }
];

export const TechnicalSpecsView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pro-card p-6 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-pink-100">
        <div className="w-11 h-11 rounded-xl bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-pink-600 shadow-[2px_2px_0px_#F472B6]">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-pixel font-bold text-pink-950">System Technical Specifications & AI Architecture</h3>
          <p className="text-xs text-pink-700/80 mt-0.5 font-sans">
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
              className={`rounded-xl border-2 transition-all overflow-hidden ${
                isOpen
                  ? 'bg-pink-50/60 border-pink-400 shadow-[3px_3px_0px_#F472B6]'
                  : 'bg-white border-pink-200 hover:border-pink-300 shadow-[2px_2px_0px_#FBCFE8]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs font-pixel font-semibold text-pink-950 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-pink-100 text-pink-700 border border-pink-300 font-pixel text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{spec.title}</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-pink-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-pink-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs space-y-3 border-t-2 border-pink-100">
                  <p className="text-zinc-700 leading-relaxed font-sans">{spec.description}</p>

                  <div className="bg-white p-3 rounded-xl border-2 border-pink-200 space-y-1.5 shadow-[2px_2px_0px_#FBCFE8]">
                    <span className="text-[10px] uppercase font-pixel font-bold text-pink-700 tracking-wider">
                      Technical Specifications:
                    </span>
                    <ul className="space-y-1 text-zinc-600 font-sans text-[11px]">
                      {spec.specs.map((item, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
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
