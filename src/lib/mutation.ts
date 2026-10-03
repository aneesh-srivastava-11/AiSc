import { Chromosome, Location } from '@/types/route';
import { evaluateChromosome } from './fitness';

/**
 * SWAP MUTATION
 * 
 * Algorithm:
 * With probability `mutationRate`:
 * 1. Pick two distinct indices i and j randomly in the chromosome.
 * 2. Swap genes at index i and index j.
 * 3. Re-evaluate fitness score.
 */
export function swapMutate(
  chromosome: Chromosome,
  mutationRate: number,
  startLocation: Location,
  locationMap: Map<string, Location>
): Chromosome {
  const genes = [...chromosome.genes];
  const len = genes.length;

  if (len < 2) return chromosome;

  // Perform swap mutation if random roll is below mutationRate
  if (Math.random() < mutationRate) {
    const idx1 = Math.floor(Math.random() * len);
    let idx2 = Math.floor(Math.random() * len);

    // Ensure idx1 != idx2
    while (idx2 === idx1) {
      idx2 = Math.floor(Math.random() * len);
    }

    // Swap genes
    [genes[idx1], genes[idx2]] = [genes[idx2], genes[idx1]];

    return evaluateChromosome(genes, startLocation, locationMap);
  }

  return chromosome;
}
