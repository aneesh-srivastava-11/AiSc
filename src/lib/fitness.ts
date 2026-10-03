import { Chromosome, Location } from '@/types/route';
import { calculateTotalDistance } from './distance';

/**
 * Calculates fitness for a given distance.
 * Fitness = 1 / Total Distance
 * A shorter route produces a higher fitness score.
 */
export function calculateFitness(distance: number): number {
  if (distance <= 0) return 0;
  return 1 / distance;
}

/**
 * Evaluates a chromosome by mapping its gene IDs to actual Location objects,
 * calculating total distance, and assigning fitness = 1 / distance.
 */
export function evaluateChromosome(
  genes: string[],
  startLocation: Location,
  locationMap: Map<string, Location>
): Chromosome {
  const destinationLocations: Location[] = [];

  for (const id of genes) {
    const loc = locationMap.get(id);
    if (loc) {
      destinationLocations.push(loc);
    }
  }

  const totalDistance = calculateTotalDistance(startLocation, destinationLocations);
  const fitness = calculateFitness(totalDistance);

  return {
    genes: [...genes],
    fitness,
    totalDistance
  };
}
