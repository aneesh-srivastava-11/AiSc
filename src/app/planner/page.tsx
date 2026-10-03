'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PlannerForm } from '@/components/PlannerForm';
import { RouteResult } from '@/components/RouteResult';
import { OSMMap } from '@/components/OSMMap';
import { CandidateComparisonView } from '@/components/CandidateComparisonView';
import { Location, GAResult, OptimizeRequest, OptimizeResponse } from '@/types/route';

export default function PlannerPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gaResult, setGaResult] = useState<GAResult | null>(null);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleOptimize = async (request: OptimizeRequest) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Optimization request failed');
      }

      const data: OptimizeResponse = await response.json();
      setGaResult(data.result);
      setAllLocations(data.allLocations);

      // Smooth scroll to results section
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while optimizing route.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#09090B]/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-zinc-100">
                Ai-ternary
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800">
                GA + OpenStreetMap
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-8 space-y-6 flex-1">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Travel Route Optimization Engine
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Calculates optimal travel routes using Genetic Algorithms (Ordered Crossover & Swap Mutation) and OpenStreetMap GIS Geocoding.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-rose-400 font-bold hover:text-white">✕</button>
          </div>
        )}

        {/* Input Form Section */}
        <section id="input-form">
          <PlannerForm onOptimize={handleOptimize} isLoading={isLoading} />
        </section>

        {/* Optimization Results Section */}
        <div ref={resultsRef}>
          {gaResult && (
            <section className="space-y-6">
              {/* 1. Route Result Bento */}
              <RouteResult result={gaResult} />

              {/* 2. Keyless OpenStreetMap Leaflet Map */}
              <OSMMap result={gaResult} allLocations={allLocations} />

              {/* 3. Candidate Route Evaluation & Decision Selection Matrix */}
              <CandidateComparisonView result={gaResult} />
            </section>
          )}
        </div>
      </main>

      {/* Compact Clean Footer */}
      <footer className="w-full border-t border-zinc-800/60 py-4 text-center text-xs text-zinc-500 bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-4">
          <p>Ai-ternary • AI Travel Route Optimization Engine • Powered by OpenStreetMap</p>
        </div>
      </footer>
    </div>
  );
}
