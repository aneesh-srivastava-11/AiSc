import { Chromosome, Location } from '@/types/route';
import { calculateTotalDistance, euclideanDistance } from './distance';
import { calculateFitness } from './fitness';

/**
 * NEAREST NEIGHBOR HEURISTIC (Greedy Heuristic Search)
 * 
 * Algorithm:
 * 1. Start at the starting location (origin node).
 * 2. Set current_node = start_location.
 * 3. Mark current_node as visited.
 * 4. While there are unvisited destinations:
 *    a. Find unvisited destination 'v' with minimum Euclidean distance to current_node.
 *    b. Add 'v' to path.
 *    c. Mark 'v' as visited.
 *    d. Set current_node = v.
 * 5. Return ordered destinations route.
 */
export function runNearestNeighborHeuristic(
  startLocation: Location,
  destinations: Location[]
): { route: Location[]; chromosome: Chromosome } {
  if (destinations.length === 0) {
    return {
      route: [],
      chromosome: { genes: [], fitness: 0, totalDistance: 0 }
    };
  }

  const unvisited = [...destinations];
  const route: Location[] = [];
  let current = startLocation;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = euclideanDistance(current, unvisited[i]);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }

    const nearestLocation = unvisited.splice(nearestIdx, 1)[0];
    route.push(nearestLocation);
    current = nearestLocation;
  }

  const totalDistance = calculateTotalDistance(startLocation, route);
  const fitness = calculateFitness(totalDistance);
  const genes = route.map(loc => loc.id);

  return {
    route,
    chromosome: {
      genes,
      fitness,
      totalDistance
    }
  };
}

/**
 * Theoretical Explanation of Nearest Neighbor Heuristic for College Viva
 */
export const HEURISTIC_EXPLANATION = {
  title: "Nearest Neighbor (NN) Heuristic",
  concept: "A greedy heuristic search strategy that iteratively selects the closest unvisited node relative to the current position.",
  purpose: "In Ai-ternary, NN Heuristic generates a strong baseline route to seed the initial population of the Genetic Algorithm, speeding up convergence.",
  advantages: [
    "Simple time complexity of O(N^2), generating an instant route.",
    "Significantly better than pure random initialization for TSP.",
    "Provides a deterministic baseline to measure GA optimization gains against."
  ],
  limitations: [
    "Greedy approach only considers immediate local optimum (myopic decision).",
    "Can get trapped in local optima, leaving high-cost edges for the end of the route.",
    "Does not guarantee global optimal route."
  ]
};
