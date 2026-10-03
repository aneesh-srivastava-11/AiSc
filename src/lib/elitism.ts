import { Chromosome } from '@/types/route';

/**
 * ELITISM
 * 
 * Preserves top `eliteCount` chromosomes from the current population sorted by fitness.
 * Ensures the best discovered routes are never lost during crossover/mutation.
 */
export function preserveElites(
  population: Chromosome[],
  eliteCount: number
): Chromosome[] {
  if (eliteCount <= 0 || population.length === 0) {
    return [];
  }

  // Sort population by fitness descending
  const sorted = [...population].sort((a, b) => b.fitness - a.fitness);

  const count = Math.min(eliteCount, sorted.length);
  return sorted.slice(0, count).map(c => ({
    genes: [...c.genes],
    fitness: c.fitness,
    totalDistance: c.totalDistance
  }));
}
