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

export interface CandidateRoute {
  id: 'candidate_random' | 'candidate_greedy' | 'candidate_ga';
  title: string;
  strategy: string;
  route: Location[];
  totalDistance: number;
  fitnessScore: number;
  isSelectedBest: boolean;
  explanation: string;
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
}

export interface OptimizeRequest {
  start: string;
  destinations: string[];
  config?: Partial<GAConfig>;
}

export interface OptimizeResponse {
  result: GAResult;
  allLocations: Location[];
}
