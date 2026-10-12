import { Location } from '@/types/route';
import { euclideanDistance } from './distance';
import { calculateFitness } from './fitness';

export interface GreedySearchResult {
  route: Location[];
  totalDistance: number;
  fitnessScore: number;
  executionTimeMs: number;
  nodesVisited: number;
}

/**
 * Greedy Search / Nearest Neighbor Algorithm
 * 
 * Strategy:
 * Starts at origin. At each step, evaluates the immediate step cost h(n) = distance(current, v)
 * to all unvisited destinations and greedily moves to the nearest neighbor.
 * Repeats until all locations are visited, then returns to origin.
 * 
 * Time Complexity: O(N^2)
 * Space Complexity: O(N)
 */
export function runGreedySearch(
  startLocation: Location,
  destinations: Location[]
): GreedySearchResult {
  const startTime = performance.now();
  const n = destinations.length;

  if (n === 0) {
    return {
      route: [],
      totalDistance: 0,
      fitnessScore: 0,
      executionTimeMs: 0,
      nodesVisited: 0
    };
  }

  const unvisited = [...destinations];
  const route: Location[] = [];
  let current = startLocation;
  let totalDistance = 0;
  let nodesVisited = 0;

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
    totalDistance += minDistance;
    route.push(nearestLocation);
    current = nearestLocation;
    nodesVisited++;
  }

  // Return leg back to start location
  const returnDist = euclideanDistance(current, startLocation);
  totalDistance += returnDist;

  const roundedDistance = Number(totalDistance.toFixed(2));
  const endTime = performance.now();

  return {
    route,
    totalDistance: roundedDistance,
    fitnessScore: calculateFitness(roundedDistance),
    executionTimeMs: Number((endTime - startTime).toFixed(2)),
    nodesVisited
  };
}
