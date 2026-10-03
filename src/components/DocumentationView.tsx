'use client';

import React from 'react';
import { FileText, Cpu, GitBranch, Target, Compass, Sparkles, CheckCircle } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-violet-950 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Project Academic Documentation</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured report format for college submission and AI course project evaluation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Section 1: Problem Statement */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-[11px] tracking-wider">
            <Target className="w-3.5 h-3.5" /> 1. Problem Statement
          </div>
          <p className="text-slate-300 leading-relaxed">
            Planning a multi-destination travel itinerary involves finding the shortest route that visits a set of chosen places and returns to the origin. This is a classic NP-Hard Traveling Salesperson Problem (TSP). As the number of destinations increases, the number of possible routes grows factorially (N!). Brute-force search becomes computationally impossible, requiring intelligent heuristic and evolutionary optimization algorithms.
          </p>
        </div>

        {/* Section 2: Objectives */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px] tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" /> 2. Objectives
          </div>
          <ul className="text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Implement a pure Genetic Algorithm (GA) with Tournament Selection, Ordered Crossover (OX), and Swap Mutation.</li>
            <li>Incorporate Nearest Neighbor (NN) Heuristic Search to seed the initial population for accelerated convergence.</li>
            <li>Provide real-time 2D spatial SVG graph visualization of nodes and optimized route paths.</li>
            <li>Demonstrate core AI principles without relying on Machine Learning or external APIs.</li>
          </ul>
        </div>

        {/* Section 3: Methodology */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-violet-400 font-bold uppercase text-[11px] tracking-wider">
            <Cpu className="w-3.5 h-3.5" /> 3. AI Methodology
          </div>
          <p className="text-slate-300 leading-relaxed">
            Ai-ternary combines <strong>Nearest Neighbor Heuristic Search</strong> with a <strong>Genetic Algorithm</strong>. The NN Heuristic creates a greedy initial solution that seeds Chromosome 1. The GA then initializes a population of 100 chromosomes, evaluating fitness as <code>1 / Total Distance</code>. Over 100 generations, top elites are preserved while remaining chromosomes undergo tournament selection, ordered crossover, and swap mutation.
          </p>
        </div>

        {/* Section 4: System Architecture */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-[11px] tracking-wider">
            <GitBranch className="w-3.5 h-3.5" /> 4. System Architecture
          </div>
          <p className="text-slate-300 leading-relaxed">
            Built as a single-repo serverless application using Next.js 16 App Router and TypeScript. The frontend collects user input and dispatches a request to <code>/api/optimize</code>. The route handler maps locations to 2D coordinates, invokes the modular GA engine (<code>genetic.ts</code>, <code>heuristic.ts</code>, <code>crossover.ts</code>), and returns complete generation history and spatial graph data.
          </p>
        </div>
      </div>

      {/* SVG Flowchart Diagram */}
      <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          5. Genetic Algorithm Flowchart Diagram
        </h4>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 flex justify-center">
          <svg viewBox="0 0 700 240" className="w-full max-w-2xl h-auto">
            <defs>
              <marker id="fcArrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#818CF8" />
              </marker>
            </defs>

            {/* Box 1: Input & Coordinates */}
            <rect x="20" y="90" width="110" height="60" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
            <text x="75" y="118" textAnchor="middle" fill="#F1F5F9" fontSize="10" fontWeight="bold">Input Locations</text>
            <text x="75" y="132" textAnchor="middle" fill="#94A3B8" fontSize="9">Generate 2D (x,y)</text>

            <line x1="130" y1="120" x2="160" y2="120" stroke="#818CF8" strokeWidth="2" markerEnd="url(#fcArrow)" />

            {/* Box 2: NN Heuristic Seed */}
            <rect x="160" y="90" width="120" height="60" rx="10" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
            <text x="220" y="118" textAnchor="middle" fill="#A7F3D0" fontSize="10" fontWeight="bold">NN Heuristic Seed</text>
            <text x="220" y="132" textAnchor="middle" fill="#6EE7B7" fontSize="9">Pop Initializer</text>

            <line x1="280" y1="120" x2="310" y2="120" stroke="#818CF8" strokeWidth="2" markerEnd="url(#fcArrow)" />

            {/* Box 3: GA Evolution Loop */}
            <rect x="310" y="75" width="140" height="90" rx="10" fill="#311B92" stroke="#8B5CF6" strokeWidth="1.5" />
            <text x="380" y="102" textAnchor="middle" fill="#DDD6FE" fontSize="10" fontWeight="bold">GA Loop (100 Gen)</text>
            <text x="380" y="118" textAnchor="middle" fill="#C4B5FD" fontSize="8">• Tournament (k=5)</text>
            <text x="380" y="132" textAnchor="middle" fill="#C4B5FD" fontSize="8">• Ordered Crossover</text>
            <text x="380" y="146" textAnchor="middle" fill="#C4B5FD" fontSize="8">• Swap Mutation (5%)</text>

            <line x1="450" y1="120" x2="480" y2="120" stroke="#818CF8" strokeWidth="2" markerEnd="url(#fcArrow)" />

            {/* Box 4: Elitism & Evaluation */}
            <rect x="480" y="90" width="100" height="60" rx="10" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1.5" />
            <text x="530" y="118" textAnchor="middle" fill="#C7D2FE" fontSize="10" fontWeight="bold">Elitism & Fit</text>
            <text x="530" y="132" textAnchor="middle" fill="#818CF8" fontSize="9">Top 5 Preserved</text>

            <line x1="580" y1="120" x2="610" y2="120" stroke="#818CF8" strokeWidth="2" markerEnd="url(#fcArrow)" />

            {/* Box 5: Optimal Route */}
            <rect x="610" y="90" width="80" height="60" rx="10" fill="#064E3B" stroke="#34D399" strokeWidth="1.5" />
            <text x="650" y="118" textAnchor="middle" fill="#A7F3D0" fontSize="10" fontWeight="bold">Best Route</text>
            <text x="650" y="132" textAnchor="middle" fill="#6EE7B7" fontSize="9">SVG Path</text>
          </svg>
        </div>
      </div>

      {/* Future Scope & Conclusion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-indigo-400 font-bold uppercase text-[11px] tracking-wider">6. Future Scope</div>
          <p className="text-slate-300 leading-relaxed">
            Future enhancements include integrating real-world GIS coordinates (Haversine distance), multi-objective optimization (minimizing distance + travel time + financial budget), and implementing Partially Mapped Crossover (PMX) for alternative heuristic comparison.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-emerald-400 font-bold uppercase text-[11px] tracking-wider">7. Conclusion</div>
          <p className="text-slate-300 leading-relaxed">
            The Ai-ternary project successfully demonstrates the power of Genetic Algorithms and Heuristic Search for complex route optimization. By seeding the population with a Nearest Neighbor Heuristic and applying OX crossover with swap mutation, the algorithm converges on near-optimal travel itineraries in sub-second execution times.
          </p>
        </div>
      </div>
    </div>
  );
};
