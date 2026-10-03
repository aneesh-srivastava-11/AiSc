import React from 'react';
import Link from 'next/link';
import { Compass, Dna, ArrowRight, ShieldCheck, Cpu, MapPin } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-900 font-bold flex items-center justify-center text-xs">
            AI
          </div>
          <span className="font-bold text-base tracking-tight text-zinc-100">
            Ai-ternary
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/planner"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-900 shadow-sm transition-all flex items-center gap-1.5"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
            <span>AI Search & Decision Engine • OpenStreetMap GIS</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight leading-tight">
            Travel Route Optimization Engine <br />
            <span className="text-zinc-400 font-normal">Genetic Algorithm & Heuristic Search</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Calculates optimal multi-destination travel routes by evolving route chromosomes using Tournament Selection, Ordered Crossover (OX), Swap Mutation, and OpenStreetMap GIS geocoding.
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <Link
              href="/planner"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold bg-zinc-100 hover:bg-white text-zinc-900 shadow-md gap-2 transition-all cursor-pointer"
            >
              <span>Launch Travel Planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: GA Engine */}
          <div className="pro-card p-5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sky-400">
              <Dna className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Genetic Algorithm Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Evolves 100 chromosomes over 100 generations using Ordered Crossover (OX), Swap Mutation, and Elitism.
            </p>
          </div>

          {/* Card 2: Heuristic Component */}
          <div className="pro-card p-5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Nearest Neighbor Heuristic</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Greedy heuristic search seeds initial chromosome solution, accelerating convergence speed and baseline comparison.
            </p>
          </div>

          {/* Card 3: OpenStreetMap GIS */}
          <div className="pro-card p-5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-200">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">OpenStreetMap GIS & Leaflet</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Geocodes location names via OpenStreetMap Nominatim API and calculates real Haversine distances on dark map layers.
            </p>
          </div>
        </div>

        {/* AI Compliance Banner */}
        <div className="pro-card p-5 rounded-2xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-zinc-200">Pure Artificial Intelligence Engine</h4>
              <p className="text-[11px] text-zinc-400">
                Built strictly with Artificial Intelligence search & decision-making logic. No Machine Learning, No External AI APIs.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="w-full border-t border-zinc-800/60 py-4 text-center text-xs text-zinc-500 bg-[#09090B]">
        <p>Ai-ternary • AI Travel Route Optimization Engine • Powered by OpenStreetMap</p>
      </footer>
    </div>
  );
}
