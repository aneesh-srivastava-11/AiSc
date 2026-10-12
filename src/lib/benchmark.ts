import { AlgorithmBenchmarkResult, AlgorithmType, CandidateRoute, GAConfig, GAResult, Location } from '@/types/route';
import { runAStarSearch } from './astar';
import { runBFSSearch } from './bfs';
import { runDFSSearch } from './dfs';
import { runGeneticAlgorithm } from './genetic';
import { runGreedySearch } from './greedy';
import { calculateTotalDistance } from './distance';
import { calculateFitness } from './fitness';

export interface MultiAlgorithmBenchmarkOptions {
  config?: Partial<GAConfig>;
  selectedAlgorithm?: 'all' | AlgorithmType;
}

export function runMultiAlgorithmBenchmark(
  startLocation: Location,
  destinations: Location[],
  options?: MultiAlgorithmBenchmarkOptions
): GAResult {
  const overallStart = performance.now();

  // 1. Run Genetic Algorithm (GA)
  const gaResult = runGeneticAlgorithm(startLocation, destinations, options?.config);

  // 2. Run A* Search
  const astarResult = runAStarSearch(startLocation, destinations);

  // 3. Run Greedy Search (Nearest Neighbor)
  const greedyResult = runGreedySearch(startLocation, destinations);

  // 4. Run Breadth-First Search (BFS) with Branch-and-Bound
  const bfsResult = runBFSSearch(startLocation, destinations);

  // 5. Run Depth-First Search (DFS) with Branch-and-Bound
  const dfsResult = runDFSSearch(startLocation, destinations);

  // 6. Sequential Unoptimized (as baseline)
  const sequentialDests = [...destinations];
  const sequentialDist = calculateTotalDistance(startLocation, sequentialDests);
  const sequentialFitness = calculateFitness(sequentialDist);

  // Build unified benchmark results
  const rawList: Omit<AlgorithmBenchmarkResult, 'isSelectedBest'>[] = [
    {
      id: 'astar',
      name: 'A* Search (A-Star)',
      shortName: 'A*',
      category: 'Informed Heuristic Search',
      route: astarResult.route,
      totalDistance: astarResult.totalDistance,
      fitnessScore: astarResult.fitnessScore,
      executionTimeMs: astarResult.executionTimeMs,
      nodesExpanded: astarResult.nodesExpanded,
      optimality: 'Guaranteed Global Optimal',
      timeComplexity: 'O(b^d) with MST Heuristic Pruning',
      spaceComplexity: 'O(b^d) Priority Queue',
      dataStructure: 'Min-Heap Priority Queue',
      explanation: 'Uses evaluation function f(n) = g(n) + h(n) with an admissible Minimum Spanning Tree (MST) heuristic. Mathematically guaranteed to find the true global shortest route.',
      color: '#10B981' // Emerald
    },
    {
      id: 'ga',
      name: 'Genetic Algorithm (GA)',
      shortName: 'GA',
      category: 'Evolutionary Metaheuristic',
      route: gaResult.bestRoute,
      totalDistance: gaResult.totalDistance,
      fitnessScore: gaResult.fitnessScore,
      executionTimeMs: gaResult.executionTimeMs,
      nodesExpanded: gaResult.generationsRun * (options?.config?.populationSize || 100),
      optimality: 'Near-Optimal',
      timeComplexity: 'O(g × p × N) Linear in Generations',
      spaceComplexity: 'O(p × N) Population Array',
      dataStructure: 'Chromosomes & Generation Arrays',
      explanation: 'Evolves 100 candidate routes over 100 generations using Tournament Selection (k=5), Ordered Crossover (OX), Swap Mutation (5%), and Elitism (Top 5).',
      color: '#0EA5E9' // Sky Blue
    },
    {
      id: 'greedy',
      name: 'Greedy Search (Nearest Neighbor)',
      shortName: 'Greedy',
      category: 'Greedy Local Search',
      route: greedyResult.route,
      totalDistance: greedyResult.totalDistance,
      fitnessScore: greedyResult.fitnessScore,
      executionTimeMs: greedyResult.executionTimeMs,
      nodesExpanded: greedyResult.nodesVisited,
      optimality: 'Local Optimum Trap',
      timeComplexity: 'O(N^2) Deterministic',
      spaceComplexity: 'O(N) Traversal Array',
      dataStructure: 'Array & Distance Min-Scan',
      explanation: 'At each node, greedily selects the closest unvisited destination (h(n) step cost). Very fast, but myopic and prone to getting trapped in suboptimal local minima.',
      color: '#F59E0B' // Amber
    },
    {
      id: 'bfs',
      name: 'Breadth-First Search (BFS)',
      shortName: 'BFS',
      category: 'Uninformed Level Search',
      route: bfsResult.route,
      totalDistance: bfsResult.totalDistance,
      fitnessScore: bfsResult.fitnessScore,
      executionTimeMs: bfsResult.executionTimeMs,
      nodesExpanded: bfsResult.nodesExpanded,
      optimality: 'Pruned Optimal',
      timeComplexity: 'O(N!) worst-case, reduced via B&B',
      spaceComplexity: 'O(b^d) Level-by-level Queue',
      dataStructure: 'FIFO Queue',
      explanation: 'Explores permutation space level-by-level using a FIFO Queue. Prunes any sub-branch where accumulated distance g(n) exceeds the best-known tour bound.',
      color: '#8B5CF6' // Purple
    },
    {
      id: 'dfs',
      name: 'Depth-First Search (DFS)',
      shortName: 'DFS',
      category: 'Uninformed Depth Search',
      route: dfsResult.route,
      totalDistance: dfsResult.totalDistance,
      fitnessScore: dfsResult.fitnessScore,
      executionTimeMs: dfsResult.executionTimeMs,
      nodesExpanded: dfsResult.nodesExpanded,
      optimality: 'Pruned Optimal',
      timeComplexity: 'O(N!) worst-case, reduced via Greedy B&B',
      spaceComplexity: 'O(N) Linear Call Stack',
      dataStructure: 'LIFO Stack / Recursive Backtracking',
      explanation: 'Explores deep candidate tours down to leaf solutions before backtracking. Sorts branches nearest-first to rapidly tighten the upper bound and prune branches early.',
      color: '#EC4899' // Rose
    }
  ];

  // Determine the winning algorithm (lowest distance; tie-break with fastest execution time)
  let minDistance = Infinity;
  let bestAlgorithmId: AlgorithmType = 'astar';

  for (const item of rawList) {
    if (item.totalDistance < minDistance) {
      minDistance = item.totalDistance;
      bestAlgorithmId = item.id;
    } else if (item.totalDistance === minDistance) {
      const currentBest = rawList.find(a => a.id === bestAlgorithmId);
      if (currentBest && item.executionTimeMs < currentBest.executionTimeMs) {
        bestAlgorithmId = item.id;
      }
    }
  }

  // Finalize algorithm benchmark list
  const algorithmList: AlgorithmBenchmarkResult[] = rawList.map(item => ({
    ...item,
    isSelectedBest: item.id === bestAlgorithmId
  }));

  const algorithms = algorithmList.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<AlgorithmType, AlgorithmBenchmarkResult>);

  const winningAlgorithm = algorithms[bestAlgorithmId];

  // Construct comprehensive candidate list for CandidateComparisonView
  const candidates: CandidateRoute[] = [
    {
      id: 'candidate_astar',
      title: 'A* Search (A-Star)',
      strategy: 'Informed Heuristic Search (MST Heuristic)',
      route: astarResult.route,
      totalDistance: astarResult.totalDistance,
      fitnessScore: astarResult.fitnessScore,
      isSelectedBest: bestAlgorithmId === 'astar',
      explanation: 'Provably optimal search using f(n) = g(n) + h(n) with admissible Minimum Spanning Tree relaxation heuristic.',
      algorithmId: 'astar',
      executionTimeMs: astarResult.executionTimeMs,
      nodesExpanded: astarResult.nodesExpanded,
      optimality: 'Guaranteed Global Optimal'
    },
    {
      id: 'candidate_ga',
      title: 'Genetic Algorithm (GA)',
      strategy: 'Evolutionary Metaheuristic (OX & Swap Mutation)',
      route: gaResult.bestRoute,
      totalDistance: gaResult.totalDistance,
      fitnessScore: gaResult.fitnessScore,
      isSelectedBest: bestAlgorithmId === 'ga',
      explanation: 'Simulates biological evolution over 100 generations using tournament selection, ordered crossover, and elitism.',
      algorithmId: 'ga',
      executionTimeMs: gaResult.executionTimeMs,
      nodesExpanded: gaResult.generationsRun * (options?.config?.populationSize || 100),
      optimality: 'Near-Optimal'
    },
    {
      id: 'candidate_greedy',
      title: 'Greedy Search (Nearest Neighbor)',
      strategy: 'Greedy Local Search',
      route: greedyResult.route,
      totalDistance: greedyResult.totalDistance,
      fitnessScore: greedyResult.fitnessScore,
      isSelectedBest: bestAlgorithmId === 'greedy',
      explanation: 'Iteratively selects the nearest unvisited node. Extremely fast, but susceptible to local optima near route completion.',
      algorithmId: 'greedy',
      executionTimeMs: greedyResult.executionTimeMs,
      nodesExpanded: greedyResult.nodesVisited,
      optimality: 'Local Optimum Trap'
    },
    {
      id: 'candidate_bfs',
      title: 'Breadth-First Search (BFS)',
      strategy: 'Uninformed Level Search (Branch-and-Bound)',
      route: bfsResult.route,
      totalDistance: bfsResult.totalDistance,
      fitnessScore: bfsResult.fitnessScore,
      isSelectedBest: bestAlgorithmId === 'bfs',
      explanation: 'Traverses permutation tree level-by-level with a FIFO queue. Prunes paths that exceed the best-known tour distance.',
      algorithmId: 'bfs',
      executionTimeMs: bfsResult.executionTimeMs,
      nodesExpanded: bfsResult.nodesExpanded,
      optimality: 'Pruned Optimal'
    },
    {
      id: 'candidate_dfs',
      title: 'Depth-First Search (DFS)',
      strategy: 'Uninformed Depth Search (Branch-and-Bound)',
      route: dfsResult.route,
      totalDistance: dfsResult.totalDistance,
      fitnessScore: dfsResult.fitnessScore,
      isSelectedBest: bestAlgorithmId === 'dfs',
      explanation: 'Explores deep tour branches to leaves before backtracking. Nearest-first branch ordering provides aggressive pruning.',
      algorithmId: 'dfs',
      executionTimeMs: dfsResult.executionTimeMs,
      nodesExpanded: dfsResult.nodesExpanded,
      optimality: 'Pruned Optimal'
    },
    {
      id: 'candidate_random',
      title: 'Sequential Route (Baseline)',
      strategy: 'Unoptimized Direct Order',
      route: sequentialDests,
      totalDistance: sequentialDist,
      fitnessScore: sequentialFitness,
      isSelectedBest: false,
      explanation: 'Visits destinations in unoptimized user-input order, serving as the raw baseline before AI optimization.',
      optimality: 'Unoptimized'
    }
  ];

  const overallTime = Number((performance.now() - overallStart).toFixed(2));
  const hDist = greedyResult.totalDistance;
  const bestDist = winningAlgorithm.totalDistance;
  const improvement = hDist > 0 ? Number((((hDist - bestDist) / hDist) * 100).toFixed(2)) : 0;

  return {
    startLocation,
    bestRoute: winningAlgorithm.route,
    totalDistance: winningAlgorithm.totalDistance,
    fitnessScore: winningAlgorithm.fitnessScore,
    generationsRun: gaResult.generationsRun,
    fitnessHistory: gaResult.fitnessHistory,
    heuristicDistance: hDist,
    heuristicRoute: greedyResult.route,
    candidates,
    improvementPercentage: Math.max(0, improvement),
    executionTimeMs: overallTime,
    chromosomeCount: options?.config?.populationSize || 100,
    config: gaResult.config,
    algorithms,
    algorithmList,
    winningAlgorithmId: bestAlgorithmId,
    selectedAlgorithmId: options?.selectedAlgorithm && options.selectedAlgorithm !== 'all' ? options.selectedAlgorithm : bestAlgorithmId
  };
}
