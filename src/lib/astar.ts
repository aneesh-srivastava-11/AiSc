import { Location } from '@/types/route';
import { euclideanDistance } from './distance';
import { calculateFitness } from './fitness';

export interface AStarSearchResult {
  route: Location[];
  totalDistance: number;
  fitnessScore: number;
  executionTimeMs: number;
  nodesExpanded: number;
  nodesGenerated: number;
}

interface PriorityQueueNode {
  currentIdx: number;
  visitedMask: number;
  path: number[];
  g: number;
  h: number;
  f: number;
}

class MinPriorityQueue {
  private heap: PriorityQueueNode[] = [];

  get size(): number {
    return this.heap.length;
  }

  push(node: PriorityQueueNode): void {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): PriorityQueueNode | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const bottom = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.bubbleDown(0);
    }
    return top;
  }

  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.heap[idx].f < this.heap[parentIdx].f) {
        const temp = this.heap[idx];
        this.heap[idx] = this.heap[parentIdx];
        this.heap[parentIdx] = temp;
        idx = parentIdx;
      } else {
        break;
      }
    }
  }

  private bubbleDown(idx: number): void {
    const length = this.heap.length;
    while (true) {
      let left = 2 * idx + 1;
      let right = 2 * idx + 2;
      let smallest = idx;

      if (left < length && this.heap[left].f < this.heap[smallest].f) {
        smallest = left;
      }
      if (right < length && this.heap[right].f < this.heap[smallest].f) {
        smallest = right;
      }

      if (smallest !== idx) {
        const temp = this.heap[idx];
        this.heap[idx] = this.heap[smallest];
        this.heap[smallest] = temp;
        idx = smallest;
      } else {
        break;
      }
    }
  }
}

/**
 * Computes Minimum Spanning Tree (MST) weight of unvisited vertices using Prim's algorithm.
 * An MST is a provably admissible and consistent heuristic for TSP.
 */
function computeMSTWeight(unvisited: number[], distMatrix: number[][]): number {
  const k = unvisited.length;
  if (k <= 1) return 0;

  let totalMSTWeight = 0;
  const inMST = new Array<boolean>(k).fill(false);
  const minCost = new Array<number>(k).fill(Infinity);

  // Start Prim's with first vertex in unvisited
  inMST[0] = true;
  for (let i = 1; i < k; i++) {
    minCost[i] = distMatrix[unvisited[0]][unvisited[i]];
  }

  for (let step = 1; step < k; step++) {
    let bestIdx = -1;
    let bestCost = Infinity;

    for (let i = 1; i < k; i++) {
      if (!inMST[i] && minCost[i] < bestCost) {
        bestCost = minCost[i];
        bestIdx = i;
      }
    }

    if (bestIdx === -1) break;

    inMST[bestIdx] = true;
    totalMSTWeight += bestCost;

    for (let i = 1; i < k; i++) {
      if (!inMST[i]) {
        const edgeWeight = distMatrix[unvisited[bestIdx]][unvisited[i]];
        if (edgeWeight < minCost[i]) {
          minCost[i] = edgeWeight;
        }
      }
    }
  }

  return totalMSTWeight;
}

/**
 * Admissible Heuristic function h(state) for TSP:
 * h(state) = MST(Unvisited) + min(dist(current, u)) + min(dist(u, start))
 */
function calculateHeuristic(
  currentIdx: number,
  visitedMask: number,
  n: number,
  distMatrix: number[][]
): number {
  const unvisited: number[] = [];
  for (let i = 1; i <= n; i++) {
    if ((visitedMask & (1 << (i - 1))) === 0) {
      unvisited.push(i);
    }
  }

  if (unvisited.length === 0) {
    // Return distance directly to start node (node 0)
    return distMatrix[currentIdx][0];
  }

  const mstWeight = computeMSTWeight(unvisited, distMatrix);

  let minCurrentToUnvisited = Infinity;
  let minUnvisitedToStart = Infinity;

  for (const u of unvisited) {
    const toUnvisited = distMatrix[currentIdx][u];
    if (toUnvisited < minCurrentToUnvisited) minCurrentToUnvisited = toUnvisited;

    const toStart = distMatrix[u][0];
    if (toStart < minUnvisitedToStart) minUnvisitedToStart = toStart;
  }

  return mstWeight + minCurrentToUnvisited + minUnvisitedToStart;
}

/**
 * A* (A-Star) Search Engine for Traveling Salesperson Problem
 * 
 * Uses evaluation function f(n) = g(n) + h(n), where:
 * - g(n) is the exact accumulated geodesic distance so far.
 * - h(n) is the admissible Minimum Spanning Tree (MST) + endpoint relaxation heuristic.
 * 
 * Guaranteed to find the exact mathematically optimal route!
 */
export function runAStarSearch(
  startLocation: Location,
  destinations: Location[]
): AStarSearchResult {
  const startTime = performance.now();
  const n = destinations.length;

  if (n === 0) {
    return {
      route: [],
      totalDistance: 0,
      fitnessScore: 0,
      executionTimeMs: 0,
      nodesExpanded: 0,
      nodesGenerated: 0
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
      nodesGenerated: 1
    };
  }

  // Precompute full distance matrix (index 0 = startLocation, 1..n = destinations)
  const allNodes = [startLocation, ...destinations];
  const distMatrix: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      distMatrix[i][j] = i === j ? 0 : euclideanDistance(allNodes[i], allNodes[j]);
    }
  }

  const pq = new MinPriorityQueue();
  const goalMask = (1 << n) - 1;

  let nodesExpanded = 0;
  let nodesGenerated = 0;

  // Initial State: at start (0), no destinations visited yet
  const initialH = calculateHeuristic(0, 0, n, distMatrix);
  pq.push({
    currentIdx: 0,
    visitedMask: 0,
    path: [],
    g: 0,
    h: initialH,
    f: initialH
  });
  nodesGenerated++;

  // Closed map to avoid expanding suboptimal duplicate paths to same state (current, visitedMask)
  const visitedBestG = new Map<string, number>();

  while (pq.size > 0) {
    const current = pq.pop()!;
    nodesExpanded++;

    // Check if goal reached: all n destinations visited
    if (current.visitedMask === goalMask) {
      const finalDist = Number((current.g + distMatrix[current.currentIdx][0]).toFixed(2));
      const optimalRoute = current.path.map(idx => destinations[idx - 1]);
      const endTime = performance.now();

      return {
        route: optimalRoute,
        totalDistance: finalDist,
        fitnessScore: calculateFitness(finalDist),
        executionTimeMs: Number((endTime - startTime).toFixed(2)),
        nodesExpanded,
        nodesGenerated
      };
    }

    const stateKey = `${current.currentIdx}:${current.visitedMask}`;
    const bestKnownG = visitedBestG.get(stateKey);
    if (bestKnownG !== undefined && bestKnownG < current.g) {
      continue;
    }
    visitedBestG.set(stateKey, current.g);

    // Expand unvisited successor destinations
    for (let nextIdx = 1; nextIdx <= n; nextIdx++) {
      const maskBit = 1 << (nextIdx - 1);
      if ((current.visitedMask & maskBit) === 0) {
        const nextVisitedMask = current.visitedMask | maskBit;
        const stepDist = distMatrix[current.currentIdx][nextIdx];
        const nextG = current.g + stepDist;

        const nextStateKey = `${nextIdx}:${nextVisitedMask}`;
        const prevBestG = visitedBestG.get(nextStateKey);
        if (prevBestG !== undefined && prevBestG <= nextG) {
          continue;
        }

        const nextH = calculateHeuristic(nextIdx, nextVisitedMask, n, distMatrix);
        const nextF = nextG + nextH;

        pq.push({
          currentIdx: nextIdx,
          visitedMask: nextVisitedMask,
          path: [...current.path, nextIdx],
          g: nextG,
          h: nextH,
          f: nextF
        });
        nodesGenerated++;
      }
    }
  }

  // Fallback fallback if priority queue exhausts without goal (should never happen)
  const fallbackDist = distMatrix[0][1] * 2;
  return {
    route: [destinations[0]],
    totalDistance: fallbackDist,
    fitnessScore: calculateFitness(fallbackDist),
    executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
    nodesExpanded,
    nodesGenerated
  };
}
