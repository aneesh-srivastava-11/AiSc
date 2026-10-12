import { Location } from '@/types/route';
import { euclideanDistance } from './distance';
import { calculateFitness } from './fitness';
import { runGreedySearch } from './greedy';

export interface BFSSearchResult {
  route: Location[];
  totalDistance: number;
  fitnessScore: number;
  executionTimeMs: number;
  nodesExpanded: number;
  prunedBranches: number;
  queuePeakSize: number;
}

interface BFSNode {
  currentIdx: number;
  visitedMask: number;
  path: number[];
  g: number;
}

/**
 * Breadth-First Search (BFS) with Branch-and-Bound Pruning
 * 
 * Strategy:
 * Explores the permutation state space level-by-level using a FIFO Queue.
 * Employs an incumbent upper bound (seeded by Greedy Nearest Neighbor) to prune
 * any branch where accumulated distance g(n) exceeds the best-known tour cost.
 * 
 * Time Complexity: O(N!) worst-case unpruned; significantly reduced by Branch-and-Bound.
 * Space Complexity: O(b^d) level-by-level queue width.
 */
export function runBFSSearch(
  startLocation: Location,
  destinations: Location[]
): BFSSearchResult {
  const startTime = performance.now();
  const n = destinations.length;

  if (n === 0) {
    return {
      route: [],
      totalDistance: 0,
      fitnessScore: 0,
      executionTimeMs: 0,
      nodesExpanded: 0,
      prunedBranches: 0,
      queuePeakSize: 0
    };
  }

  if (n === 1) {
    const legDist = euclideanDistance(startLocation, destinations[0]);
    const roundTrip = Number((legDist * 2).toFixed(2));
    return {
      route: [destinations[0]],
      totalDistance: roundTrip,
      fitnessScore: calculateFitness(roundTrip),
      executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
      nodesExpanded: 1,
      prunedBranches: 0,
      queuePeakSize: 1
    };
  }

  // Precompute distance matrix (0 = start, 1..n = destinations)
  const allNodes = [startLocation, ...destinations];
  const distMatrix: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      distMatrix[i][j] = i === j ? 0 : euclideanDistance(allNodes[i], allNodes[j]);
    }
  }

  // Seed initial upper bound from Greedy heuristic
  const greedySeed = runGreedySearch(startLocation, destinations);
  let bestDistance = greedySeed.totalDistance;
  let bestPath: number[] = greedySeed.route.map(loc => destinations.findIndex(d => d.id === loc.id) + 1);

  // FIFO Queue initialization
  const queue: BFSNode[] = [
    {
      currentIdx: 0,
      visitedMask: 0,
      path: [],
      g: 0
    }
  ];

  const goalMask = (1 << n) - 1;
  let nodesExpanded = 0;
  let prunedBranches = 0;
  let queuePeakSize = 1;
  let head = 0;

  // Maximum expansion threshold for safety
  const MAX_EXPANSIONS = 80000;

  while (head < queue.length && nodesExpanded < MAX_EXPANSIONS) {
    const current = queue[head++];
    nodesExpanded++;

    // Track peak queue size
    const currentQueueLength = queue.length - head;
    if (currentQueueLength > queuePeakSize) {
      queuePeakSize = currentQueueLength;
    }

    // Branch-and-bound bounding check
    if (current.g >= bestDistance) {
      prunedBranches++;
      continue;
    }

    // If all destinations are visited in this branch
    if (current.visitedMask === goalMask) {
      const returnCost = distMatrix[current.currentIdx][0];
      const finalCost = Number((current.g + returnCost).toFixed(2));
      if (finalCost < bestDistance) {
        bestDistance = finalCost;
        bestPath = [...current.path];
      }
      continue;
    }

    // Expand next level children
    for (let nextIdx = 1; nextIdx <= n; nextIdx++) {
      const maskBit = 1 << (nextIdx - 1);
      if ((current.visitedMask & maskBit) === 0) {
        const stepDist = distMatrix[current.currentIdx][nextIdx];
        const nextG = current.g + stepDist;

        // Prune if accumulated cost already exceeds best tour found so far
        if (nextG >= bestDistance) {
          prunedBranches++;
          continue;
        }

        queue.push({
          currentIdx: nextIdx,
          visitedMask: current.visitedMask | maskBit,
          path: [...current.path, nextIdx],
          g: nextG
        });
      }
    }
  }

  const roundedDistance = Number(bestDistance.toFixed(2));
  const optimalRoute = bestPath.map(idx => destinations[idx - 1]);
  const endTime = performance.now();

  return {
    route: optimalRoute,
    totalDistance: roundedDistance,
    fitnessScore: calculateFitness(roundedDistance),
    executionTimeMs: Number((endTime - startTime).toFixed(2)),
    nodesExpanded,
    prunedBranches,
    queuePeakSize
  };
}
