import React from 'react';
import Link from 'next/link';
import { Compass, Dna, ArrowRight, ShieldCheck, MapPin, Layers, GitBranch, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF5F8] text-zinc-800 flex flex-col justify-between selection:bg-pink-200 selection:text-pink-900">
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 h-16 flex items-center justify-between border-b border-pink-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-500 text-white font-pixel font-bold flex items-center justify-center text-xs shadow-[2px_2px_0px_#9D174D]">
            AI
          </div>
          <span className="font-pixel font-bold text-lg tracking-tight text-pink-950">
            Ai-ternary
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-pixel bg-pink-100 text-pink-700 border border-pink-200">
            v2.0 Classical AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/planner"
            className="pixel-btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
          >
            <span>Launch Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 space-y-16 flex-1">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-pink-300 text-pink-800 text-xs font-pixel shadow-[2px_2px_0px_#F472B6]">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>5 AI Search Paradigms • Multi-Algorithm Benchmark Arena</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-pixel font-bold text-pink-950 tracking-tight leading-tight">
            Travel Route Optimization Engine <br />
            <span className="text-pink-600 font-medium text-2xl sm:text-3xl block mt-2">
              A* • Genetic Algorithm • Greedy • BFS • DFS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto font-sans">
            Calculates optimal multi-destination travel itineraries and benchmarks 5 classical Artificial Intelligence search algorithms: <strong>A* Search</strong> with admissible MST heuristic, <strong>Genetic Algorithm</strong>, <strong>Greedy Search</strong>, <strong>Breadth-First Search (BFS)</strong>, and <strong>Depth-First Search (DFS)</strong> with Branch-and-Bound pruning on real OpenStreetMap coordinates.
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <Link
              href="/planner"
              className="pixel-btn-primary inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm gap-2"
            >
              <span>Launch Multi-Algorithm Planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature Bento Grid (6 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: A* Engine */}
          <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-[2px_2px_0px_#10B981]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <h3 className="text-sm font-pixel font-bold text-pink-950">A* Search (Informed Heuristic)</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-sans">
              Uses <code>f(n) = g(n) + h(n)</code> with an admissible Minimum Spanning Tree (MST) relaxation heuristic to guarantee the mathematically optimal route.
            </p>
          </div>

          {/* Card 2: GA Engine */}
          <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-700 shadow-[2px_2px_0px_#F472B6]">
              <Dna className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-pixel font-bold text-pink-950">Genetic Algorithm (Metaheuristic)</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-sans">
              Evolves 100 chromosomes over 100 generations using Tournament Selection, Ordered Crossover (OX), Swap Mutation, and Elitism.
            </p>
          </div>

          {/* Card 3: Greedy Search */}
          <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-[2px_2px_0px_#F59E0B]">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-pixel font-bold text-pink-950">Greedy Search (Nearest Neighbor)</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-sans">
              Rapid O(N²) deterministic baseline selecting the closest unvisited node at each step; exposes local optimum traps near route completion.
            </p>
          </div>

          {/* Card 4: BFS with B&B */}
          <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 shadow-[2px_2px_0px_#8B5CF6]">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-pixel font-bold text-pink-950">Breadth-First Search (BFS)</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-sans">
              Level-by-level state space exploration using a FIFO Queue bounded by dynamic Branch-and-Bound to prune unpromising subpaths.
            </p>
          </div>

          {/* Card 5: DFS with B&B */}
          <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shadow-[2px_2px_0px_#EC4899]">
              <GitBranch className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-pixel font-bold text-pink-950">Depth-First Search (DFS)</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-sans">
              Deep recursive exploration with greedy branch ordering for fast tight bounds and aggressive subtree pruning in minimal O(N) memory.
            </p>
          </div>

          {/* Card 6: OpenStreetMap GIS */}
          <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-700 shadow-[2px_2px_0px_#F472B6]">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-pixel font-bold text-pink-950">OpenStreetMap GIS & Leaflet</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-sans">
              Live keyless geocoding via OpenStreetMap Nominatim and geodesic Haversine distance calculations rendered on soothing light map layers.
            </p>
          </div>
        </div>

        {/* AI Compliance Banner */}
        <div className="pro-card p-5 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-pixel font-bold text-pink-950">Pure Classical Artificial Intelligence Implementation</h4>
              <p className="text-[11px] text-zinc-600 font-sans mt-0.5">
                Strict adherence to classic AI search and heuristic optimization. No Machine Learning models, No Neural Networks, No Third-Party LLM APIs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-[11px] font-pixel bg-pink-100 border border-pink-300 text-pink-800 shadow-[1px_1px_0px_#F472B6]">
              Deterministic & Reproducible AI
            </span>
          </div>
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="w-full border-t border-pink-200 py-4 text-center text-xs text-pink-800/80 bg-white">
        <p className="font-pixel">Ai-ternary • AI Multi-Algorithm Search Benchmark (A*, GA, Greedy, BFS, DFS) • Powered by OpenStreetMap</p>
      </footer>
    </div>
  );
}
