import { Chromosome } from '@/types/route';

/**
 * TOURNAMENT SELECTION
 * 
 * Selects K (tournamentSize) random chromosomes from the current population
 * and returns the one with the highest fitness value.
 */
export function tournamentSelection(
  population: Chromosome[],
  tournamentSize: number
): Chromosome {
  const popSize = population.length;
  if (popSize === 0) {
    throw new Error('Population cannot be empty');
  }

  const k = Math.min(tournamentSize, popSize);
  let best: Chromosome | null = null;

  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * popSize);
    const candidate = population[randomIndex];

    if (best === null || candidate.fitness > best.fitness) {
      best = candidate;
    }
  }

  return { ...best! };
}
