import { Chromosome, Location } from '@/types/route';
import { evaluateChromosome } from './fitness';

/**
 * ORDERED CROSSOVER (OX)
 * 
 * Specifically designed for Permutation/TSP problems to prevent duplicate cities.
 * 
 * Algorithm:
 * 1. Pick 2 random cut points in Parent 1.
 * 2. Copy the substring between cut points directly into Child.
 * 3. Fill the remaining slots in Child using genes from Parent 2 in the order
 *    they appear, skipping any genes already present in Child.
 */
export function orderedCrossover(
  parentA: Chromosome,
  parentB: Chromosome,
  startLocation: Location,
  locationMap: Map<string, Location>
): Chromosome {
  const len = parentA.genes.length;

  if (len <= 2) {
    // For very short routes (1 or 2 destinations), crossover returns clone
    return evaluateChromosome([...parentA.genes], startLocation, locationMap);
  }

  // 1. Pick 2 random cut points
  let cut1 = Math.floor(Math.random() * len);
  let cut2 = Math.floor(Math.random() * len);

  if (cut1 > cut2) {
    [cut1, cut2] = [cut2, cut1];
  } else if (cut1 === cut2) {
    if (cut2 < len - 1) cut2++;
    else cut1--;
  }

  const childGenes: (string | null)[] = new Array(len).fill(null);
  const inheritedGenes = new Set<string>();

  // 2. Copy slice from Parent A
  for (let i = cut1; i <= cut2; i++) {
    childGenes[i] = parentA.genes[i];
    inheritedGenes.add(parentA.genes[i]);
  }

  // 3. Fill remaining empty slots using Parent B's gene ordering
  let parentBIndex = 0;
  for (let i = 0; i < len; i++) {
    if (childGenes[i] === null) {
      while (parentBIndex < len && inheritedGenes.has(parentB.genes[parentBIndex])) {
        parentBIndex++;
      }

      if (parentBIndex < len) {
        childGenes[i] = parentB.genes[parentBIndex];
        inheritedGenes.add(parentB.genes[parentBIndex]);
        parentBIndex++;
      }
    }
  }

  // Fallback check: if any null remaining, fill with missing
  const cleanGenes = childGenes.filter((g): g is string => g !== null);

  return evaluateChromosome(cleanGenes, startLocation, locationMap);
}
