'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, GraduationCap, Code } from 'lucide-react';

interface VivaQuestion {
  question: string;
  answer: string;
  keyPoints: string[];
}

const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    question: "What is a Genetic Algorithm (GA)?",
    answer: "A Genetic Algorithm is a heuristic optimization technique inspired by Charles Darwin's theory of natural evolution. It simulates processes such as selection, crossover, and mutation to iteratively evolve a population of candidate solutions toward an optimal or near-optimal solution.",
    keyPoints: [
      "Belongs to Evolutionary Computation field of AI",
      "Works on a population of candidate solutions simultaneously",
      "Does not require gradient information or explicit mathematical derivatives"
    ]
  },
  {
    question: "What is a chromosome in this travel planner?",
    answer: "A chromosome represents a complete candidate solution to the travel route problem. In Ai-ternary, a chromosome is encoded as an ordered permutation array of destination IDs (e.g. ['Amer Fort', 'Jal Mahal', 'Hawa Mahal']). Each destination in the array represents a gene.",
    keyPoints: [
      "Genotype: Array of destination IDs",
      "Phenotype: The spatial travel path traversed in order",
      "Fixed length corresponding to number of destinations"
    ]
  },
  {
    question: "How is Fitness defined and evaluated?",
    answer: "Fitness measures the quality of a solution chromosome. In Ai-ternary, Fitness is defined as Fitness = 1 / Total Euclidean Distance. Because lower travel distance is desirable, taking the reciprocal converts a minimization objective (distance) into a maximization objective (fitness).",
    keyPoints: [
      "Fitness = 1 / Total Distance",
      "Shorter route -> Smaller denominator -> Higher fitness score",
      "Ensures fittest routes have highest probability of selection"
    ]
  },
  {
    question: "What is Tournament Selection and why use it?",
    answer: "Tournament Selection picks k random chromosomes from the population, compares their fitness scores, and selects the winner with highest fitness. It avoids premature convergence and allows tuning of selection pressure by adjusting tournament size k.",
    keyPoints: [
      "Tournament size k = 5 used in Ai-ternary",
      "Prevents single dominant chromosome from taking over population",
      "Efficient time complexity of O(k)"
    ]
  },
  {
    question: "What is Ordered Crossover (OX) and why is it used instead of single-point crossover?",
    answer: "Ordered Crossover (OX) is a specialized crossover operator for permutation problems like TSP. Standard single-point crossover would create invalid routes containing duplicate cities and missing cities. OX copies a contiguous slice from Parent A and fills remaining positions in order from Parent B, preserving valid permutations.",
    keyPoints: [
      "Prevents duplicate destination visits",
      "Preserves relative ordering of cities from both parents",
      "Essential for Traveling Salesperson Problems"
    ]
  },
  {
    question: "What is Swap Mutation and what is its role?",
    answer: "Swap Mutation randomly selects two gene positions in a chromosome and swaps their values with probability mutationRate (5%). Its role is to introduce new genetic variations, prevent premature convergence, and help the algorithm escape local optima.",
    keyPoints: [
      "Mutation rate set to 5% (0.05)",
      "Swaps 2 random cities in the route",
      "Maintains diversity across generations"
    ]
  },
  {
    question: "What is Elitism and why is it important?",
    answer: "Elitism preserves the top N fittest chromosomes (Top 5 in Ai-ternary) from the current generation directly into the next generation without modification. It guarantees that the best solution found so far is never destroyed or degraded by crossover or mutation.",
    keyPoints: [
      "Elite count = 5 chromosomes",
      "Guarantees monotonically non-decreasing best fitness",
      "Protects top solutions across generations"
    ]
  },
  {
    question: "What is a Heuristic in Artificial Intelligence?",
    answer: "A heuristic is a practical rule-of-thumb or technique designed for solving a problem quickly when classic methods are too slow or exact solutions are computationally infeasible. It prioritizes speed and good-enough accuracy over guaranteed mathematical perfection.",
    keyPoints: [
      "Gives practical, near-optimal solutions in fast time",
      "Guides search through large state spaces",
      "Used when exact exhaustive search is intractable"
    ]
  },
  {
    question: "What is Nearest Neighbor (NN) Heuristic?",
    answer: "Nearest Neighbor is a greedy heuristic search algorithm for TSP. It starts at an origin node and repeatedly visits the closest unvisited destination until all destinations have been visited. In Ai-ternary, it is used to seed the initial population with a high-quality initial chromosome.",
    keyPoints: [
      "Greedy search approach with O(N^2) complexity",
      "Always picks local minimum distance step",
      "Seeds Chromosome 1 to accelerate GA convergence"
    ]
  },
  {
    question: "Why use Genetic Algorithms instead of Brute Force Search?",
    answer: "For N destinations, brute force search evaluates N! (factorial) possible route permutations. For 10 destinations, 10! = 3.6 million routes. For 20 destinations, 20! = 2.4 × 10^18 routes, which is impossible to compute in real time. GA finds near-optimal routes in O(g × p × N) time.",
    keyPoints: [
      "Brute force complexity is O(N!), exploding exponentially",
      "GA complexity is linear with respect to generations and population: O(g × p × N)",
      "GA scales efficiently to large destination sets"
    ]
  },
  {
    question: "What are the main Advantages of Genetic Algorithms?",
    answer: "1) Efficient exploration of massive, complex search spaces. 2) Does not require gradient or mathematical derivative functions. 3) Easily parallelizable. 4) Robust against getting stuck in single local minimum compared to pure greedy algorithms.",
    keyPoints: [
      "Global optimization capability",
      "Flexible and customizable for custom constraints",
      "Combines exploration (crossover/mutation) and exploitation (selection/elitism)"
    ]
  },
  {
    question: "What are the Limitations of Genetic Algorithms?",
    answer: "1) No theoretical guarantee of finding the absolute global optimum. 2) Computationally more expensive than pure greedy heuristics for small N. 3) Sensitive to hyperparameter tuning (population size, mutation rate).",
    keyPoints: [
      "Stochastic nature yields slight variations per run",
      "Hyperparameter tuning required for optimal performance",
      "Can suffer from premature convergence if selection pressure is too high"
    ]
  }
];

export const VivaPrepAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Viva Voce Preparation & Key Questions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Model Q&A designed for college external examiners and viva evaluations.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {VIVA_QUESTIONS.map((q, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-slate-950/90 border-indigo-500/40 shadow-md'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-slate-200 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-indigo-400 font-mono text-[11px] flex items-center justify-center shrink-0">
                    Q{idx + 1}
                  </span>
                  <span>{q.question}</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs space-y-3 border-t border-slate-800/60">
                  <p className="text-slate-300 leading-relaxed font-sans">{q.answer}</p>
                  
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Key Talking Points for Viva:</span>
                    <ul className="space-y-1 text-slate-400">
                      {q.keyPoints.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>{point}</span>
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
