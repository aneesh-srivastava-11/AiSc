export interface Location {
  id: string;
  name: string;
  lat: number;  // Real-world latitude from OSM Nominatim
  lon: number;  // Real-world longitude from OSM Nominatim
  x: number;    // Normalized 0-100 canvas coordinate fallback
  y: number;    // Normalized 0-100 canvas coordinate fallback
  category?: 'landmark' | 'fort' | 'palace' | 'temple' | 'nature' | 'custom';
  formattedAddress?: string;
}

export interface Chromosome {
  genes: string[]; // Ordered list of destination IDs (excluding start)
  fitness: number; // 1 / totalDistance
  totalDistance: number; // Distance in kilometers
}

export interface GAConfig {
  populationSize: number; // e.g. 100
  generations: number;    // e.g. 100
  tournamentSize: number; // e.g. 5
  mutationRate: number;   // e.g. 0.05
  eliteCount: number;     // e.g. 5
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
