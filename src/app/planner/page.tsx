'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, GraduationCap, Cpu, Layers, FileText } from 'lucide-react';
import { PlannerForm } from '@/components/PlannerForm';
import { RouteResult } from '@/components/RouteResult';
import { OSMMap } from '@/components/OSMMap';
import { CandidateComparisonView } from '@/components/CandidateComparisonView';
import { AlgorithmExplainer } from '@/components/AlgorithmExplainer';
import { VivaPrepAccordion } from '@/components/VivaPrepAccordion';
import { TechnicalSpecsView } from '@/components/TechnicalSpecsView';
import { DocumentationView } from '@/components/DocumentationView';
import { Location, GAResult, OptimizeRequest, OptimizeResponse, AlgorithmType } from '@/types/route';

export default function PlannerPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gaResult, setGaResult] = useState<GAResult | null>(null);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeAlgorithmId, setActiveAlgorithmId] = useState<AlgorithmType>('astar');
  const [activeBottomTab, setActiveBottomTab] = useState<'explainer' | 'viva' | 'specs' | 'report'>('explainer');

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

      if (data.result.winningAlgorithmId) {
        setActiveAlgorithmId(data.result.winningAlgorithmId);
      }

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
    <div className="min-h-screen bg-[#FFF5F8] text-zinc-800 flex flex-col justify-between selection:bg-pink-200 selection:text-pink-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-pink-50 border-2 border-pink-300 text-pink-700 hover:bg-pink-100 transition-colors shadow-[1px_1px_0px_#F472B6]"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-pixel font-bold text-sm tracking-tight text-pink-950">
                Ai-ternary
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-pixel text-pink-800 bg-pink-100 border border-pink-300">
                A* • GA • Greedy • BFS • DFS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-pixel text-pink-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
            <span>OpenStreetMap GIS Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-8 space-y-8 flex-1">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-pixel font-bold text-pink-950 tracking-tight">
            Multi-Algorithm Travel Route Optimization
          </h1>
          <p className="text-xs text-zinc-600 mt-1 max-w-2xl leading-relaxed font-sans">
            Compare 5 Artificial Intelligence search algorithms: <strong>A* Search</strong> (Admissible MST Heuristic), <strong>Genetic Algorithm</strong> (OX Recombination), <strong>Greedy Search</strong> (Nearest Neighbor), <strong>Breadth-First Search (BFS)</strong>, and <strong>Depth-First Search (DFS)</strong> with Branch-and-Bound pruning.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs flex items-center justify-between shadow-[2px_2px_0px_#FECDD3]">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-rose-600 font-bold hover:text-rose-900 cursor-pointer">✕</button>
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
              <RouteResult
                result={gaResult}
                activeAlgorithmId={activeAlgorithmId}
                onSelectAlgorithm={setActiveAlgorithmId}
              />

              {/* 2. Keyless OpenStreetMap Leaflet Map */}
              <OSMMap
                result={gaResult}
                allLocations={allLocations}
                activeAlgorithmId={activeAlgorithmId}
                onSelectAlgorithm={setActiveAlgorithmId}
              />

              {/* 3. Candidate Route Evaluation & Decision Selection Matrix */}
              <CandidateComparisonView
                result={gaResult}
                activeAlgorithmId={activeAlgorithmId}
                onSelectAlgorithm={setActiveAlgorithmId}
              />
            </section>
          )}
        </div>

        {/* Bottom Educational, Viva, & Technical Documentation Hub */}
        <section className="space-y-4 pt-4 border-t-2 border-pink-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-pixel font-bold uppercase tracking-wider text-pink-950 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-pink-500" />
                AI Theory, Viva Q&A & Technical Architecture Hub
              </h2>
              <p className="text-xs text-zinc-600 mt-0.5 font-sans">
                Explore in-depth algorithm mechanisms, examination questions, and computational complexity benchmarks.
              </p>
            </div>

            {/* Hub Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-xl border-2 border-pink-200 shadow-[2px_2px_0px_#FBCFE8] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveBottomTab('explainer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-pixel font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeBottomTab === 'explainer'
                    ? 'bg-pink-500 text-white shadow-[2px_2px_0px_#9D174D]'
                    : 'text-zinc-600 hover:text-pink-950 hover:bg-pink-50'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                Algorithm Labs
              </button>

              <button
                type="button"
                onClick={() => setActiveBottomTab('viva')}
                className={`px-3 py-1.5 rounded-lg text-xs font-pixel font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeBottomTab === 'viva'
                    ? 'bg-pink-500 text-white shadow-[2px_2px_0px_#9D174D]'
                    : 'text-zinc-600 hover:text-pink-950 hover:bg-pink-50'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Viva Prep Q&A
              </button>

              <button
                type="button"
                onClick={() => setActiveBottomTab('specs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-pixel font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeBottomTab === 'specs'
                    ? 'bg-pink-500 text-white shadow-[2px_2px_0px_#9D174D]'
                    : 'text-zinc-600 hover:text-pink-950 hover:bg-pink-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Tech Specs
              </button>

              <button
                type="button"
                onClick={() => setActiveBottomTab('report')}
                className={`px-3 py-1.5 rounded-lg text-xs font-pixel font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeBottomTab === 'report'
                    ? 'bg-pink-500 text-white shadow-[2px_2px_0px_#9D174D]'
                    : 'text-zinc-600 hover:text-pink-950 hover:bg-pink-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Academic Report
              </button>
            </div>
          </div>

          {/* Active Tab Panel */}
          <div>
            {activeBottomTab === 'explainer' && <AlgorithmExplainer />}
            {activeBottomTab === 'viva' && <VivaPrepAccordion />}
            {activeBottomTab === 'specs' && <TechnicalSpecsView />}
            {activeBottomTab === 'report' && <DocumentationView />}
          </div>
        </section>
      </main>

      {/* Compact Clean Footer */}
      <footer className="w-full border-t-2 border-pink-200 py-4 text-center text-xs text-pink-800/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 font-pixel">
          <p>Ai-ternary • AI Multi-Algorithm Search Engine (A*, GA, Greedy, BFS, DFS) • Powered by OpenStreetMap</p>
        </div>
      </footer>
    </div>
  );
}
