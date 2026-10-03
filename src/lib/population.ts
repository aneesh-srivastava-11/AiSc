import { Chromosome, GAConfig, Location } from '@/types/route';
import { evaluateChromosome } from './fitness';
import { runNearestNeighborHeuristic } from './heuristic';

/**
 * Shuffles an array randomly using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Initializes GA Population:
 * - 1st Chromosome: Seeded using Nearest Neighbor Heuristic
 * - Remaining (popSize - 1) Chromosomes: Random valid permutations of destination IDs
 */
export function initializePopulation(
  startLocation: Location,
  destinations: Location[],
  config: GAConfig
): Chromosome[] {
  const population: Chromosome[] = [];
  const baseGeneIds = destinations.map(d => d.id);
  const locationMap = new Map<string, Location>();
  destinations.forEach(d => locationMap.set(d.id, d));

  if (baseGeneIds.length === 0) return population;

  // 1. Seed with Nearest Neighbor Heuristic
  const heuristicResult = runNearestNeighborHeuristic(startLocation, destinations);
  population.push(heuristicResult.chromosome);

  // 2. Fill remaining population size with random permutations
  while (population.length < config.populationSize) {
    const randomGenes = shuffle(baseGeneIds);
    const chromosome = evaluateChromosome(randomGenes, startLocation, locationMap);
    population.push(chromosome);
  }

  return population;
}
