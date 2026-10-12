import { Location } from '@/types/route';
import { euclideanDistance } from './distance';
import { calculateFitness } from './fitness';
import { runGreedySearch } from './greedy';

export interface DFSSearchResult {
  route: Location[];
  totalDistance: number;
  fitnessScore: number;
  executionTimeMs: number;
  nodesExpanded: number;
  prunedBranches: number;
  maxDepthReached: number;
}

/**
 * Depth-First Search (DFS) with Branch-and-Bound Pruning & Greedy Branch Ordering
 * 
 * Strategy:
 * Explores deep candidate paths down to complete leaf tours before backtracking.
 * Sorts unvisited successors by proximity (Greedy-guided ordering) to rapidly tighten
 * the upper bound, allowing massive subtrees to be pruned early via Branch-and-Bound.
 * 
 * Time Complexity: O(N!) worst-case unpruned; pruned to near-linear in typical spatial graphs.
 * Space Complexity: O(N) linear stack space.
 */
export function runDFSSearch(
  startLocation: Location,
  destinations: Location[]
): DFSSearchResult {
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
      maxDepthReached: 0
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
      maxDepthReached: 1
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

  // Seed upper bound with greedy solution
  const greedySeed = runGreedySearch(startLocation, destinations);
  let bestDistance = greedySeed.totalDistance;
  let bestPath: number[] = greedySeed.route.map(loc => destinations.findIndex(d => d.id === loc.id) + 1);

  const goalMask = (1 << n) - 1;
  let nodesExpanded = 0;
  let prunedBranches = 0;
  let maxDepthReached = 0;

  function dfs(currentIdx: number, visitedMask: number, g: number, path: number[], depth: number): void {
    nodesExpanded++;
    if (depth > maxDepthReached) {
      maxDepthReached = depth;
    }

    // Branch-and-bound pruning check
    if (g >= bestDistance) {
      prunedBranches++;
      return;
    }

    // If all destinations visited, close the tour back to start
    if (visitedMask === goalMask) {
      const returnCost = distMatrix[currentIdx][0];
      const finalCost = Number((g + returnCost).toFixed(2));
      if (finalCost < bestDistance) {
        bestDistance = finalCost;
        bestPath = [...path];
      }
      return;
    }

    // Collect unvisited destinations
    const unvisited: { idx: number; dist: number }[] = [];
    for (let nextIdx = 1; nextIdx <= n; nextIdx++) {
      const maskBit = 1 << (nextIdx - 1);
      if ((visitedMask & maskBit) === 0) {
        unvisited.push({
          idx: nextIdx,
          dist: distMatrix[currentIdx][nextIdx]
        });
      }
    }

    // Sort unvisited branches nearest-first (Greedy ordering heuristic)
    unvisited.sort((a, b) => a.dist - b.dist);

    for (const child of unvisited) {
      const nextG = g + child.dist;
      if (nextG >= bestDistance) {
        prunedBranches++;
        continue;
      }

      path.push(child.idx);
      dfs(child.idx, visitedMask | (1 << (child.idx - 1)), nextG, path, depth + 1);
      path.pop(); // Backtrack
    }
  }

  dfs(0, 0, 0, [], 0);

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
    maxDepthReached
  };
}
