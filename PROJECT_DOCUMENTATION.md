# Ai-ternary: Comprehensive Project Documentation & Viva Guide
## AI-Based Travel Planner Using Genetic Algorithm & Heuristic Search

---

## 1. Executive Summary & Overview

**Ai-ternary** is a serverless Artificial Intelligence web application designed to solve multi-destination travel itinerary optimization. It maps real-world locations using **OpenStreetMap (OSM) Nominatim Geocoding**, calculates exact geodesic distances using the **Haversine formula**, and determines the optimal traversal sequence using a hybrid **Genetic Algorithm (GA)** seeded with a **Nearest Neighbor (NN) Greedy Heuristic**.

### Strict Artificial Intelligence Constraints Adhered To:
- **No Machine Learning / Neural Networks**: Pure search and decision-making algorithms.
- **No External AI APIs**: Fully self-contained evolutionary computation engine.
- **No Datasets / Training**: Operates dynamically on user-provided spatial inputs.
- **Keyless OpenStreetMap GIS**: Uses 100% public, keyless GIS geocoding and map rendering.

---

## 2. Problem Statement & Theoretical Context

### The Traveling Salesperson Problem (TSP) in Travel Planning
Given an origin starting location $S$ and a set of $N$ destinations $D = \{d_1, d_2, \dots, d_N\}$, the objective is to find a permutation $\pi$ of the destinations that minimizes the total round-trip distance:

$$\text{Total Distance} = \text{dist}(S, d_{\pi(1)}) + \sum_{i=1}^{N-1} \text{dist}(d_{\pi(i)}, d_{\pi(i+1)}) + \text{dist}(d_{\pi(N)}, S)$$

### Combinatorial Explosion & Brute-Force Failure
For $N$ destinations, the total number of possible distinct route permutations is given by $N!$ (factorial):

| Destinations ($N$) | Permutations ($N!$) | Brute-Force Evaluation Time (1ms per route) |
|---|---|---|
| 5 | 120 | 0.12 seconds |
| 10 | 3,628,800 | 1 hour |
| 15 | 1.307 × 10¹² | 41 years |
| 20 | 2.432 × 10¹⁸ | 77 million years |

Because TSP is **NP-Hard**, exhaustive brute-force search is computationally impossible for realistic travel itineraries. Heuristic and evolutionary search algorithms are required to discover near-optimal solutions in sub-second execution times.

---

## 3. System Architecture & End-to-End Workflow

```
[User Form Input] (Start Location + Destination List)
       │
       ▼
[OpenStreetMap Nominatim Geocoding API]
       │ (Fetch Real Latitude & Longitude Coordinates)
       ▼
[Haversine Geodesic Distance Matrix Builder]
       │
       ├────────────────────────────────────────┐
       ▼                                        ▼
[Nearest Neighbor Greedy Heuristic]     [Random Permutation Generator]
       │ (Generates Initial Seed)                │ (99 Random Chromosomes)
       └──────────────────┬─────────────────────┘
                          ▼
            [Population Initialization] (100 Chromosomes)
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
  [Fitness Evaluation]        [Elitism Preservation]
  (Fitness = 1 / Distance)    (Top 5 Preserved Directly)
            │                           │
            ▼                           │
  [Tournament Selection] (k=5)           │
            │                           │
            ▼                           │
  [Ordered Crossover (OX)]              │
            │                           │
            ▼                           │
  [Swap Mutation] (Rate = 5%)           │
            │                           │
            └─────────────┬─────────────┘
                          ▼
             [Next Generation Construction]
             (Repeat for 100 Generations)
                          │
                          ▼
            [Candidate Decision Engine]
            (Evaluates Candidate A vs B vs C)
                          │
                          ▼
            [Leaflet OpenStreetMap View & Itinerary Output]
```

---

## 4. AI Algorithm Mechanics & Implementations

### 4.1. Geocoding & Distance Calculation (Haversine Formula)
Locations are geocoded using OpenStreetMap's Nominatim API. Geodesic distance on Earth's sphere is calculated using the **Haversine formula**:

$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1) \cdot \cos(\phi_2) \cdot \sin^2\left(\frac{\Delta \lambda}{2}\right)$$

$$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$

$$d = R \cdot c \quad \text{where } R = 6371 \text{ km}$$

### 4.2. Nearest Neighbor (NN) Greedy Heuristic
- **Algorithm**: Starts at the origin node $S$. At each step, selects the closest unvisited destination $d_k$ relative to the current position until all $N$ destinations are visited.
- **Time Complexity**: $\mathcal{O}(N^2)$.
- **Role in Ai-ternary**: Seeds Chromosome 1 of the initial GA population. This hybrid approach (Memetic Algorithm) ensures the GA starts with a strong baseline rather than pure random noise.

### 4.3. Genetic Algorithm (GA) Engine
- **Population Size**: 100 Chromosomes
- **Generations**: 100 Evolutionary Iterations
- **Chromosome Representation**: Genotype encoded as an ordered array of destination IDs `["Amer Fort", "Jal Mahal", "Hawa Mahal", ...]`. Phenotype represents the spatial travel route.
- **Fitness Function**:
  $$\text{Fitness} = \frac{1}{\text{Total Haversine Distance (km)}}$$
  Shorter distance yields a smaller denominator, resulting in a higher fitness score.

- **Tournament Selection ($k = 5$)**:
  $k = 5$ random chromosomes are sampled from the population. The chromosome with the highest fitness wins the tournament and is selected as a parent.

- **Ordered Crossover (OX)**:
  Standard crossover produces invalid TSP routes with duplicate cities. OX preserves gene ordering:
  1. Pick two random cut points in Parent A.
  2. Copy the slice between cut points directly into Child.
  3. Fill remaining slots in Child using genes from Parent B in the order they appear, skipping genes already present.

- **Swap Mutation (Rate = 0.05 / 5%)**:
  Picks two random gene positions in the chromosome and swaps their values. Introduces genetic diversity to escape local minima.

- **Elitism (Top 5)**:
  Preserves the top 5 fittest chromosomes directly into the next generation without crossover or mutation. Guarantees non-decreasing best fitness.

---

## 5. Candidate Route Evaluation & Decision Matrix

To demonstrate decision-making transparency, the engine evaluates 3 distinct candidate routes:

1. **Candidate A (Sequential Unoptimized)**: Visits destinations in the exact order typed by the user. High distance, lowest fitness.
2. **Candidate B (Greedy Nearest Neighbor)**: Always picks the nearest unvisited node. Fast, but susceptible to local minimum traps.
3. **Candidate C (Genetic Algorithm Winner)**: Recombines traits across 100 generations to find the global minimum $\rightarrow$ **★ SELECTED BEST ROUTE**.

---

## 6. Code Module Structure Reference

| File Path | Description |
|---|---|
| `src/types/route.ts` | Shared TypeScript interfaces (`Location`, `Chromosome`, `GAResult`, `CandidateRoute`). |
| `src/lib/distance.ts` | Haversine formula calculation & OpenStreetMap Nominatim geocoding. |
| `src/lib/fitness.ts` | Fitness evaluation module (`Fitness = 1 / Distance`). |
| `src/lib/heuristic.ts` | Nearest Neighbor Greedy Search algorithm implementation. |
| `src/lib/population.ts` | Population initialization (NN seed + random permutations). |
| `src/lib/selection.ts` | Tournament Selection operator ($k=5$). |
| `src/lib/crossover.ts` | Ordered Crossover (OX) operator. |
| `src/lib/mutation.ts` | Swap Mutation operator (5% rate). |
| `src/lib/elitism.ts` | Elitism preservation module (Top 5). |
| `src/lib/genetic.ts` | Main GA orchestrator & candidate evaluation matrix builder. |
| `src/app/api/optimize/route.ts` | Next.js serverless route handler (POST endpoint). |
| `src/components/OSMMap.tsx` | Leaflet OpenStreetMap interactive dark map renderer. |
| `src/components/LocationAutocomplete.tsx` | Live OpenStreetMap place suggestion input dropdown. |

---

## 7. Model Viva Voce Questions & Answers

### Q1: What is a Genetic Algorithm (GA)?
**Answer**: A Genetic Algorithm is a stochastic optimization technique inspired by natural biological evolution. It maintains a population of candidate solutions and evolves them over multiple generations using operators such as selection, crossover, and mutation to find optimal solutions to complex problems.

### Q2: What is the Travelling Salesperson Problem (TSP) and how does this app solve it?
**Answer**: TSP asks for the shortest possible route that visits a set of locations and returns to the origin. Ai-ternary solves TSP using a hybrid Genetic Algorithm seeded with a Nearest Neighbor Heuristic, evaluating real-world distance via the Haversine formula on OpenStreetMap coordinates.

### Q3: Why is fitness defined as $1 / \text{Distance}$?
**Answer**: Distance minimization is a minimization problem, whereas Genetic Algorithms naturally select for higher numbers. Taking the reciprocal $1 / \text{Distance}$ converts distance minimization into a fitness maximization problem, where shorter routes yield higher fitness scores.

### Q4: Why use Ordered Crossover (OX) instead of Single-Point Crossover?
**Answer**: Standard single-point crossover creates invalid routes with duplicate and missing cities. Ordered Crossover (OX) preserves valid permutations by copying a slice from Parent A and filling remaining slots in order from Parent B without repeating any city.

### Q5: What is the role of Swap Mutation?
**Answer**: Swap Mutation randomly swaps two cities in a route with a 5% probability. It introduces new genetic variations into the population, preventing premature convergence and helping the algorithm break out of local minima.

### Q6: What is Elitism and why is it included?
**Answer**: Elitism preserves the top 5 fittest chromosomes directly into the next generation without modification. It guarantees that the best solution found so far is never lost or degraded during evolution.

### Q7: What is the Nearest Neighbor Heuristic?
**Answer**: It is a greedy algorithm that starts at the origin and iteratively moves to the closest unvisited location. It runs in $\mathcal{O}(N^2)$ time and is used to seed the initial population of the GA for faster convergence.

### Q8: How does OpenStreetMap Geocoding work in this app?
**Answer**: Place names are sent to OpenStreetMap's Nominatim API (`https://nominatim.openstreetmap.org/search`), which returns exact latitude and longitude coordinates. The coordinates are then used by the Haversine formula to compute geodesic route distances.

### Q9: What is the computational time complexity of this GA compared to brute force?
**Answer**: Brute force has a factorial complexity of $\mathcal{O}(N!)$, which is intractable for large $N$. The Genetic Algorithm has a linear complexity of $\mathcal{O}(g \cdot p \cdot N)$, where $g=100$ (generations) and $p=100$ (population size), running in under 200 milliseconds.

### Q10: Why is this considered pure Artificial Intelligence and not Machine Learning?
**Answer**: Machine Learning relies on training statistical models on datasets. Ai-ternary uses classic Artificial Intelligence search, optimization, and decision-making techniques (Heuristic Search and Evolutionary Algorithms) operating deterministically on state space without datasets or model training.
