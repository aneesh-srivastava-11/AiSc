# Ai-ternary: Multi-Algorithm AI Travel Route Optimizer
### Pure Classical Artificial Intelligence: A*, Genetic Algorithm, Greedy, BFS, & DFS
> **Course / Academic Project**: Artificial Intelligence & Algorithmic Search  
> **UI / UX**: Retro Pixelated Light Pink & White Soothing Aesthetic  
> **GIS Engine**: 100% Keyless OpenStreetMap (Nominatim & Leaflet HOT Tiles)

---

## 📌 Complete Documentation & Viva Voce Manual
👉 **[Click here to view the Comprehensive Teacher Viva Voce Guide & Project Documentation (35+ Q&A)](./TEACHER_VIVA_AND_PROJECT_DOCUMENTATION.md)** 👈

---

## 🎯 Project Overview

**Ai-ternary** is a production-grade educational Artificial Intelligence application that models and solves the **Traveling Salesperson Problem (TSP)** on real-world geographical coordinates.

The system benchmarks and contrasts **5 foundational Classical AI search paradigms**:
1. **A* Search**: Informed heuristic search with an admissible **Minimum Spanning Tree (Prim's MST)** relaxation heuristic and a binary min-heap (guaranteed global optimum).
2. **Genetic Algorithm (GA)**: Evolutionary metaheuristic evolving 100 candidate route chromosomes over 100 generations with **Tournament Selection ($k=5$)**, **Ordered Crossover (OX1)**, **Swap Mutation (5%)**, and **Elitism**.
3. **Greedy Search (Nearest Neighbor)**: Local constructive heuristic demonstrating the "myopic local optimum trap" in $O(N^2)$ time.
4. **Breadth-First Search (BFS)**: Uninformed level-order state-space search with **Branch-and-Bound** pruning.
5. **Depth-First Search (DFS)**: Uninformed deep recursive search with **Greedy Branch Ordering** and aggressive **Branch-and-Bound** pruning in strictly linear $O(N)$ memory.

### 🛡️ Strict Classical AI Constraints Adhered To:
- **Zero Neural Networks / Deep Learning**: Operates strictly on formal state-space search, heuristics, and evolutionary algorithms.
- **Zero External AI / LLM APIs**: Fully self-contained local TypeScript computational engines.
- **Zero Training Sets or Weights**: Evaluates dynamic real-world spatial coordinates on-the-fly.
- **Keyless OpenStreetMap GIS**: Uses OpenStreetMap Nominatim for geocoding and Leaflet for map visualization without proprietary API keys or billing quotas.

---

## 📊 Algorithmic Comparison Matrix

| Feature / Metric | A* Search | Genetic Algorithm | Greedy (Nearest Neighbor) | BFS (Branch-and-Bound) | DFS (Branch-and-Bound) |
|---|---|---|---|---|---|
| **AI Paradigm** | Informed Heuristic Search | Evolutionary Metaheuristic | Greedy Local Search | Level-Order Search + Pruning | Deep Backtracking + Pruning |
| **Primary Data Structure** | Binary Min-Heap Priority Queue | Population Array (100 Chromosomes) | Visited Boolean Array | FIFO Queue | LIFO Recursion Call Stack |
| **Heuristic / Decision Rule** | $f(n) = g(n) + \text{MST}(U) + \text{in} + \text{out}$ | $\text{Fitness} = 1 / \mathcal{D}(\pi)$ | $\arg\min_{u \in U} \text{dist}(v, u)$ | Level-by-level + B&B Prune | Greedy Branch Sorting + B&B Prune |
| **Time Complexity** | $O(b^d)$ (pruned by MST) | $O(G \cdot P \cdot N)$ | $O(N^2)$ | $O(N!)$ worst case | $O(N!)$ worst case (pruned to $\ll N!$) |
| **Space Complexity** | $O(b^d)$ (Heap storage) | $O(P \cdot N)$ (Bounded) | $O(N)$ | $O(b^d)$ (Queue width) | **$O(N)$ (Strictly Linear)** |
| **Optimality Guarantee** | **Guaranteed Global Optimum** | **Near-Optimal (High Quality)** | **Suboptimal (Local Trap)** | **Guaranteed Global Optimum** | **Guaranteed Global Optimum** |

---

## 🎨 UI/UX Design System: Pixelated Light Pink & White

The user interface follows a calming, soothing retro-modern design system:
- **Palette**: Soft pastel pink canvas (`#FFF5F8`), crisp white surfaces (`#FFFFFF`), light blush accents (`#FCE7F3`), and vibrant cherry-pink pixel shadows (`#F472B6`, `#DB2777`).
- **Typography**: `Pixelify Sans` for 8-bit retro pixel headers, paired with `Plus Jakarta Sans` for body text and `JetBrains Mono` for math notation.
- **Cards & Buttons**: Crisp 2px borders with 4px solid pixel block drop shadows (`box-shadow: 4px 4px 0px #F472B6`).
- **Cartography**: OpenStreetMap Humanitarian (HOT) tiles—clean, keyless, warm, and free from commercial watermarks.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Node.js 20+
- npm or pnpm or yarn

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in your browser
# Landing Page: http://localhost:3000
# Multi-Algorithm Planner & Viva Hub: http://localhost:3000/planner
```

### Production Build Validation
```bash
npm run build
```

---

## 📁 Project Structure

```
ai-ternary/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── geocode/route.ts       # Server-side OSM geocoding proxy with offline cache
│   │   │   └── optimize/route.ts      # Multi-algorithm optimization POST & GET handler
│   │   ├── globals.css                # Pixelated light pink & white design tokens & fonts
│   │   ├── layout.tsx                 # Root layout with soothing pastel background
│   │   ├── page.tsx                   # Landing page with feature bento grid
│   │   └── planner/page.tsx           # Multi-algorithm arena, map, & documentation hub
│   ├── components/
│   │   ├── AlgorithmExplainer.tsx     # Interactive theory tabs for all 5 algorithms
│   │   ├── AlgorithmStats.tsx         # SVG convergence curve & GA parameter cards
│   │   ├── CandidateComparisonView.tsx# Decision matrix & multi-algorithm comparison arena
│   │   ├── DocumentationView.tsx      # Academic documentation report view
│   │   ├── LocationAutocomplete.tsx   # Geocoding search input with debounced suggestions
│   │   ├── OSMMap.tsx                 # Interactive Leaflet map with HOT tiles
│   │   ├── PlannerForm.tsx            # Input form with Jaipur sample pre-fill
│   │   ├── RouteGraph.tsx             # 2D Euclidean SVG spatial canvas visualizer
│   │   ├── RouteResult.tsx            # Winning route banner, latency, & metrics bento
│   │   ├── TechnicalSpecsView.tsx     # Technical specifications & Big-O benchmarks
│   │   └── VivaPrepAccordion.tsx      # Comprehensive 18+ question Viva Voce prep guide
│   ├── lib/
│   │   ├── astar.ts                   # A* Search with Admissible MST Heuristic
│   │   ├── benchmark.ts               # Multi-algorithm benchmark executor
│   │   ├── bfs.ts                     # BFS with Branch-and-Bound
│   │   ├── crossover.ts               # Ordered Crossover (OX) operator
│   │   ├── dfs.ts                     # DFS with Greedy Branch Ordering & B&B
│   │   ├── distance.ts                # Haversine & Euclidean geodesic calculations
│   │   ├── elitism.ts                 # Elitism preservation operator
│   │   ├── fitness.ts                 # Fitness score evaluator (1 / Distance)
│   │   ├── genetic.ts                 # Genetic Algorithm evolution engine
│   │   ├── greedy.ts                  # Greedy Nearest Neighbor search engine
│   │   ├── heap.ts                    # Binary Min-Heap Priority Queue for A*
│   │   ├── heuristic.ts               # Prim's MST heuristic calculator
│   │   ├── mutation.ts                # Swap mutation operator (5%)
│   │   ├── population.ts              # Permutation population initializer
│   │   └── selection.ts               # Tournament selection operator (k=5)
│   └── types/
│       └── route.ts                   # Unified TypeScript interfaces and benchmark types
├── TEACHER_VIVA_AND_PROJECT_DOCUMENTATION.md # 35+ Categorized Viva Questions with Detailed Answers
└── README.md                          # Project overview and quick start guide
```

---

## 🎓 Viva Voce Core Highlights

For quick oral defense during evaluations, keep these key points in mind:
1. **Classical AI vs Machine Learning**: Zero training data or neural networks. Solved purely with state-space search, heuristics (Prim's MST), and evolutionary genetics.
2. **A* Admissibility**: Heuristic $h(n) = \text{MST}(U) + \min \text{in} + \min \text{out} \le h^*(n)$ never overestimates because an MST is a relaxation of any Hamiltonian path spanning unvisited nodes.
3. **Ordered Crossover (OX1)**: Standard 1-point crossover creates duplicate cities on TSP permutations; OX1 preserves sub-tour sequence and relative ordering without duplicates.
4. **Greedy Pitfall**: Nearest neighbor is myopic; taking short steps early forces long, expensive closing paths back to origin.
5. **Memory: A* vs DFS**: A* requires exponential $O(b^d)$ heap memory; DFS with Branch-and-Bound operates in strictly linear $O(N)$ stack memory.
