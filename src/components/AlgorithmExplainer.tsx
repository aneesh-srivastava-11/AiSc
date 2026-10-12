'use client';

import React, { useState } from 'react';
import { Cpu, Dna, Trophy, Scissors, RefreshCw, Compass, Layers, GitBranch } from 'lucide-react';

type ExplainerTab = 'astar' | 'ga' | 'greedy' | 'bfs' | 'dfs';

export const AlgorithmExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ExplainerTab>('astar');

  return (
    <div className="pro-card p-6 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-100">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-pink-500" />
            <h3 className="text-base font-pixel font-bold text-pink-950">AI Search Algorithms Interactive Theory & Lab</h3>
          </div>
          <p className="text-xs text-pink-700/80 mt-1 font-sans">
            Visual breakdown of all 5 algorithms: A* Search, Genetic Algorithm, Greedy Search, BFS, and DFS.
          </p>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-pink-50/70 rounded-xl border-2 border-pink-200">
        <button
          type="button"
          onClick={() => setActiveTab('astar')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-pixel font-semibold transition-all cursor-pointer ${
            activeTab === 'astar'
              ? 'bg-emerald-600 text-white border-2 border-emerald-700 shadow-[2px_2px_0px_#065F46]'
              : 'pixel-btn text-emerald-800 bg-white border-pink-200 hover:bg-emerald-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          1. A* Search (Informed)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ga')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-pixel font-semibold transition-all cursor-pointer ${
            activeTab === 'ga'
              ? 'bg-pink-500 text-white border-2 border-pink-600 shadow-[2px_2px_0px_#9D174D]'
              : 'pixel-btn text-pink-700 bg-white border-pink-200 hover:bg-pink-100'
          }`}
        >
          <Dna className="w-3.5 h-3.5" />
          2. Genetic Algorithm (Metaheuristic)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('greedy')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-pixel font-semibold transition-all cursor-pointer ${
            activeTab === 'greedy'
              ? 'bg-amber-500 text-white border-2 border-amber-600 shadow-[2px_2px_0px_#92400E]'
              : 'pixel-btn text-amber-800 bg-white border-pink-200 hover:bg-amber-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          3. Greedy Search (Local)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bfs')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-pixel font-semibold transition-all cursor-pointer ${
            activeTab === 'bfs'
              ? 'bg-purple-600 text-white border-2 border-purple-700 shadow-[2px_2px_0px_#581C87]'
              : 'pixel-btn text-purple-800 bg-white border-pink-200 hover:bg-purple-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          4. BFS (Level B&B)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dfs')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-pixel font-semibold transition-all cursor-pointer ${
            activeTab === 'dfs'
              ? 'bg-rose-500 text-white border-2 border-rose-600 shadow-[2px_2px_0px_#9F1239]'
              : 'pixel-btn text-rose-800 bg-white border-pink-200 hover:bg-rose-50'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          5. DFS (Deep B&B)
        </button>
      </div>

      {/* Tab 1: A* Search */}
      {activeTab === 'astar' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-pink-50/70 border-2 border-pink-200 shadow-[2px_2px_0px_#FBCFE8]">
            <h4 className="text-sm font-pixel font-bold text-emerald-900 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              A* Search: Mathematical Formulation & Admissible MST Heuristic
            </h4>
            <p className="text-xs text-zinc-700 leading-relaxed font-sans">
              A* is an optimal informed search algorithm that guides route exploration using the evaluation function <strong>f(n) = g(n) + h(n)</strong>, where <code>g(n)</code> is the exact geodesic distance traveled from the origin, and <code>h(n)</code> is an admissible heuristic estimate of the remaining cost to visit all unvisited nodes and return.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border-2 border-emerald-200 space-y-3 font-mono text-xs shadow-[2px_2px_0px_#A7F3D0]">
              <div className="text-emerald-800 text-[11px] font-pixel font-semibold uppercase">A* Evaluation Function:</div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold">
                <code>f(n) = g(n) + h(n)</code>
              </div>
              <ul className="space-y-1.5 text-[11px] text-zinc-600 font-sans">
                <li>• <strong>g(n):</strong> Exact accumulated Haversine distance from start to current node.</li>
                <li>• <strong>h(n):</strong> Minimum Spanning Tree (MST) weight of unvisited nodes + entry/exit edges.</li>
                <li>• <strong>Data Structure:</strong> Binary Min-Heap Priority Queue ordered by f(n).</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-pink-200 space-y-3 text-xs shadow-[2px_2px_0px_#FBCFE8]">
              <div className="text-pink-800 text-[11px] font-pixel font-semibold uppercase">Why A* Guarantees Global Optimality:</div>
              <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
                Because an MST is a relaxed subgraph of any valid Hamiltonian path connecting unvisited vertices, <strong>h(n) ≤ h*(n)</strong> (never overestimates the true remaining distance).
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-[11px] font-sans">
                <strong>Admissibility Theorem:</strong> If h(n) is admissible, the first complete tour popped from the priority queue is provably the global minimum.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Genetic Algorithm */}
      {activeTab === 'ga' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-pink-50/70 border-2 border-pink-200 shadow-[2px_2px_0px_#FBCFE8]">
            <h4 className="text-sm font-pixel font-bold text-pink-950 mb-1 flex items-center gap-2">
              <Dna className="w-4 h-4 text-pink-500" />
              Genetic Algorithm (GA): Evolutionary Operators Walkthrough
            </h4>
            <p className="text-xs text-zinc-700 leading-relaxed font-sans">
              GA maintains a population of 100 chromosomes (candidate routes) and evolves them over 100 generations using biological operators: Tournament Selection, Ordered Crossover (OX), Swap Mutation, and Elitism.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border-2 border-pink-200 shadow-[2px_2px_0px_#FBCFE8]">
              <div className="text-[11px] font-pixel font-bold text-pink-700 flex items-center gap-1.5 mb-1.5">
                <Trophy className="w-3.5 h-3.5 text-pink-500" /> 1. Tournament Selection (k=5)
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                Samples 5 random chromosomes from the population; the one with highest fitness (1 / Distance) wins parenthood.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border-2 border-pink-200 shadow-[2px_2px_0px_#FBCFE8]">
              <div className="text-[11px] font-pixel font-bold text-emerald-700 flex items-center gap-1.5 mb-1.5">
                <Scissors className="w-3.5 h-3.5 text-emerald-500" /> 2. Ordered Crossover (OX)
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                Copies a contiguous subpath from Parent A, then fills remaining slots from Parent B in order, preventing duplicate cities.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border-2 border-pink-200 shadow-[2px_2px_0px_#FBCFE8]">
              <div className="text-[11px] font-pixel font-bold text-purple-700 flex items-center gap-1.5 mb-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-purple-500" /> 3. Swap Mutation & Elitism
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                Randomly swaps two cities with 5% probability to escape local optima. Top 5 elites bypass mutation into next gen.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Greedy Search */}
      {activeTab === 'greedy' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/70 border-2 border-amber-200 shadow-[2px_2px_0px_#FDE68A]">
            <h4 className="text-sm font-pixel font-bold text-amber-950 mb-1 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-500" />
              Greedy Search (Nearest Neighbor Heuristic)
            </h4>
            <p className="text-xs text-zinc-700 leading-relaxed font-sans">
              Greedy search makes the locally optimal choice at each step without considering long-term global consequences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border-2 border-amber-200 space-y-2 shadow-[2px_2px_0px_#FDE68A]">
              <div className="text-[11px] font-pixel font-bold uppercase text-amber-800">Execution Strategy:</div>
              <ol className="space-y-1.5 text-zinc-700 text-[11px] list-decimal list-inside font-sans">
                <li>Start at origin node S.</li>
                <li>Examine all unvisited destinations.</li>
                <li>Select node v with minimum distance to current node.</li>
                <li>Mark v visited, set current = v, repeat until all visited.</li>
                <li>Return to origin S.</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-pink-200 space-y-2 shadow-[2px_2px_0px_#FBCFE8]">
              <div className="text-[11px] font-pixel font-bold uppercase text-pink-800">The "Myopic" Local Optimum Trap:</div>
              <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
                Because Greedy only looks 1 step ahead, it often exhausts convenient close neighbors early. By the end of the tour, the only remaining unvisited nodes are on opposite ends of the region, forcing a huge, costly traversal back.
              </p>
              <div className="p-2 rounded-lg bg-pink-50 border border-pink-300 text-[10px] text-pink-900 font-mono">
                Complexity: O(N²) Time • O(N) Space • Deterministic
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: BFS */}
      {activeTab === 'bfs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-50/70 border-2 border-purple-200 shadow-[2px_2px_0px_#E9D5FF]">
            <h4 className="text-sm font-pixel font-bold text-purple-950 mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              Breadth-First Search (BFS) with Branch-and-Bound
            </h4>
            <p className="text-xs text-zinc-700 leading-relaxed font-sans">
              BFS explores the permutation state-space tree level-by-level using a FIFO Queue. For TSP, depth represents the number of visited cities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border-2 border-purple-200 space-y-2 shadow-[2px_2px_0px_#E9D5FF]">
              <div className="text-[11px] font-pixel font-bold uppercase text-purple-800">Level-by-Level Queue Structure:</div>
              <div className="font-mono text-[11px] space-y-1 text-purple-900 bg-purple-50 p-2.5 rounded-lg border border-purple-200">
                <div>Level 0: [Origin] (Depth 0)</div>
                <div>Level 1: [A], [B], [C] (Depth 1)</div>
                <div>Level 2: [A-B], [A-C], [B-A], [B-C]... (Depth 2)</div>
                <div>Level N: Complete candidate tours</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-pink-200 space-y-2 shadow-[2px_2px_0px_#FBCFE8]">
              <div className="text-[11px] font-pixel font-bold uppercase text-pink-800">Branch-and-Bound Bounding:</div>
              <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
                Without pruning, BFS suffers from exponential memory consumption O(b^d). Ai-ternary incorporates Branch-and-Bound: whenever a sub-path's accumulated cost <code>g(n) ≥ bestDistance</code>, the branch is immediately pruned without queuing children.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: DFS */}
      {activeTab === 'dfs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50/70 border-2 border-rose-200 shadow-[2px_2px_0px_#FECDD3]">
            <h4 className="text-sm font-pixel font-bold text-rose-950 mb-1 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-rose-500" />
              Depth-First Search (DFS) with Greedy Branch Ordering
            </h4>
            <p className="text-xs text-zinc-700 leading-relaxed font-sans">
              DFS explores down candidate branches deeply to full leaf tours before backtracking. It requires minimal linear memory O(N).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border-2 border-rose-200 space-y-2 shadow-[2px_2px_0px_#FECDD3]">
              <div className="text-[11px] font-pixel font-bold uppercase text-rose-800">Greedy Branch Ordering:</div>
              <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
                At each node, unvisited successors are sorted by distance (closest first). This heuristic branch ordering causes DFS to find high-quality tours very early in execution.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-pink-200 space-y-2 shadow-[2px_2px_0px_#FBCFE8]">
              <div className="text-[11px] font-pixel font-bold uppercase text-pink-800">Backtracking & Aggressive Pruning:</div>
              <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
                Once a tight upper bound is found, vast subtrees where <code>g(n) ≥ bestKnown</code> are immediately abandoned, reducing execution from millions of iterations to just a few milliseconds.
              </p>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-300 text-[10px] text-rose-900 font-mono">
                Space Complexity: O(N) Call Stack • Extreme Memory Efficiency
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
