export type AlgorithmType = 'astar' | 'ga' | 'greedy' | 'bfs' | 'dfs';

export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  category?: 'landmark' | 'fort' | 'palace' | 'temple' | 'nature' | 'custom';
  formattedAddress?: string;
}

export interface AlgorithmBenchmarkResult {
  id: AlgorithmType;
  name: string;
  shortName: string;
  category: 'Informed Heuristic Search' | 'Evolutionary Metaheuristic' | 'Greedy Local Search' | 'Uninformed Level Search' | 'Uninformed Depth Search';
  route: Location[];
  totalDistance: number;
  fitnessScore: number;
  executionTimeMs: number;
  nodesExpanded: number;
  optimality: 'Guaranteed Global Optimal' | 'Near-Optimal' | 'Local Optimum Trap' | 'Pruned Optimal';
  timeComplexity: string;
  spaceComplexity: string;
  dataStructure: string;
  explanation: string;
  isSelectedBest: boolean;
  color: string;
}

export interface CandidateRoute {
  id: 'candidate_random' | 'candidate_greedy' | 'candidate_ga' | string;
  title: string;
  strategy: string;
  route: Location[];
  totalDistance: number;
  fitnessScore: number;
  isSelectedBest: boolean;
  explanation: string;
  algorithmId?: AlgorithmType;
  executionTimeMs?: number;
  nodesExpanded?: number;
  optimality?: string;
}

export interface Chromosome {
  genes: string[];
  fitness: number;
  totalDistance: number;
}

export interface GAConfig {
  populationSize: number;
  generations: number;
  tournamentSize: number;
  mutationRate: number;
  eliteCount: number;
}

export interface GenerationStat {
  generation: number;
  bestFitness: number;
  bestDistance: number;
  avgFitness: number;
}

export interface GAResult {
  startLocation: Location;
  bestRoute: Location[];
  totalDistance: number;
  fitnessScore: number;
  generationsRun: number;
  fitnessHistory: GenerationStat[];
  heuristicDistance: number;
  heuristicRoute: Location[];
  candidates: CandidateRoute[];
  improvementPercentage: number;
  executionTimeMs: number;
  chromosomeCount: number;
  config: GAConfig;
  // Multi-algorithm properties
  algorithms?: Record<AlgorithmType, AlgorithmBenchmarkResult>;
  algorithmList?: AlgorithmBenchmarkResult[];
  winningAlgorithmId?: AlgorithmType;
  selectedAlgorithmId?: AlgorithmType;
}

export interface OptimizeRequest {
  start: string;
  destinations: string[];
  config?: Partial<GAConfig>;
  selectedAlgorithm?: 'all' | AlgorithmType;
}

export interface OptimizeResponse {
  result: GAResult;
  allLocations: Location[];
}

