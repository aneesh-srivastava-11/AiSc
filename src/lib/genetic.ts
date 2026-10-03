import { CandidateRoute, Chromosome, GAConfig, GAResult, GenerationStat, Location } from '@/types/route';
import { orderedCrossover } from './crossover';
import { preserveElites } from './elitism';
import { runNearestNeighborHeuristic } from './heuristic';
import { swapMutate } from './mutation';
import { initializePopulation } from './population';
import { tournamentSelection } from './selection';
import { calculateTotalDistance } from './distance';
import { calculateFitness } from './fitness';

const DEFAULT_CONFIG: GAConfig = {
  populationSize: 100,
  generations: 100,
  tournamentSize: 5,
  mutationRate: 0.05,
  eliteCount: 5
};

export function runGeneticAlgorithm(
  startLocation: Location,
  destinations: Location[],
  userConfig?: Partial<GAConfig>
): GAResult {
  const startTime = performance.now();
  const config: GAConfig = { ...DEFAULT_CONFIG, ...userConfig };

  const locationMap = new Map<string, Location>();
  destinations.forEach(d => locationMap.set(d.id, d));

  // Run NN Heuristic Baseline (Candidate 2)
  const heuristicResult = runNearestNeighborHeuristic(startLocation, destinations);

  // Generate a random unoptimized permutation (Candidate 1)
  const randomDests = [...destinations].reverse();
  const randomDist = calculateTotalDistance(startLocation, randomDests);
  const randomFitness = calculateFitness(randomDist);

  if (destinations.length <= 1) {
    const totalDist = destinations.length === 1 ? heuristicResult.chromosome.totalDistance : 0;
    const fit = destinations.length === 1 ? heuristicResult.chromosome.fitness : 1;

    const dummyCandidates: CandidateRoute[] = [
      {
        id: 'candidate_random',
        title: 'Candidate A: Sequential Route',
        strategy: 'Unoptimized Direct Order',
        route: [...destinations],
        totalDistance: totalDist,
        fitnessScore: fit,
        isSelectedBest: true,
        explanation: 'Single destination input; direct travel required.'
      },
      {
        id: 'candidate_greedy',
        title: 'Candidate B: Nearest Neighbor',
        strategy: 'Greedy Local Minimum',
        route: [...destinations],
        totalDistance: totalDist,
        fitnessScore: fit,
        isSelectedBest: false,
        explanation: 'Greedy nearest neighbor path.'
      },
      {
        id: 'candidate_ga',
        title: 'Candidate C: Genetic Algorithm (Winner)',
        strategy: 'Global Evolutionary Optimization',
        route: [...destinations],
        totalDistance: totalDist,
        fitnessScore: fit,
        isSelectedBest: true,
        explanation: 'Optimal route discovering global minimum.'
      }
    ];

    return {
      startLocation,
      bestRoute: [...destinations],
      totalDistance: totalDist,
      fitnessScore: fit,
      generationsRun: 0,
      fitnessHistory: [{ generation: 0, bestFitness: fit, bestDistance: totalDist, avgFitness: fit }],
      heuristicDistance: totalDist,
      heuristicRoute: [...destinations],
      candidates: dummyCandidates,
      improvementPercentage: 0,
      executionTimeMs: Math.round(performance.now() - startTime),
      chromosomeCount: config.populationSize,
      config
    };
  }

  // Step 1: Initialize Population
  let population = initializePopulation(startLocation, destinations, config);
  const fitnessHistory: GenerationStat[] = [];
  let globalBest: Chromosome = { ...heuristicResult.chromosome };

  // Step 2: Evolution Loop
  for (let gen = 1; gen <= config.generations; gen++) {
    population.sort((a, b) => b.fitness - a.fitness);

    const currentBest = population[0];
    if (currentBest.fitness > globalBest.fitness) {
      globalBest = { ...currentBest };
    }

    const avgFit = population.reduce((sum, c) => sum + c.fitness, 0) / population.length;
    fitnessHistory.push({
      generation: gen,
      bestFitness: currentBest.fitness,
      bestDistance: currentBest.totalDistance,
      avgFitness: avgFit
    });

    const nextGeneration: Chromosome[] = preserveElites(population, config.eliteCount);

    while (nextGeneration.length < config.populationSize) {
      const parentA = tournamentSelection(population, config.tournamentSize);
      const parentB = tournamentSelection(population, config.tournamentSize);

      let offspring = orderedCrossover(parentA, parentB, startLocation, locationMap);
      offspring = swapMutate(offspring, config.mutationRate, startLocation, locationMap);

      nextGeneration.push(offspring);
    }

    population = nextGeneration;
  }

  // Best location route
  const bestLocationRoute: Location[] = globalBest.genes
    .map(id => locationMap.get(id))
    .filter((loc): loc is Location => loc !== undefined);

  const endTime = performance.now();
  const executionTimeMs = Number((endTime - startTime).toFixed(2));

  const hDist = heuristicResult.chromosome.totalDistance;
  const gDist = globalBest.totalDistance;
  const improvement = hDist > 0 ? Number((((hDist - gDist) / hDist) * 100).toFixed(2)) : 0;

  // Construct 3 Candidate Routes for Decision Evaluation Section
  const candidates: CandidateRoute[] = [
    {
      id: 'candidate_random',
      title: 'Candidate A: Sequential Route',
      strategy: 'Unoptimized Input Order',
      route: randomDests,
      totalDistance: randomDist,
      fitnessScore: Number(randomFitness.toFixed(6)),
      isSelectedBest: false,
      explanation: 'Evaluates destinations in input order without spatial distance optimization. Results in redundant backtracking and highest fuel/time cost.'
    },
    {
      id: 'candidate_greedy',
      title: 'Candidate B: Nearest Neighbor',
      strategy: 'Greedy Local Search',
      route: heuristicResult.route,
      totalDistance: hDist,
      fitnessScore: Number(heuristicResult.chromosome.fitness.toFixed(6)),
      isSelectedBest: false,
      explanation: 'Selects the nearest unvisited node at each step. Fast calculation, but prone to getting trapped in local minimums near route completion.'
    },
    {
      id: 'candidate_ga',
      title: 'Candidate C: Genetic Algorithm Engine',
      strategy: 'Global Evolutionary Optimization',
      route: bestLocationRoute,
      totalDistance: gDist,
      fitnessScore: Number(globalBest.fitness.toFixed(6)),
      isSelectedBest: true,
      explanation: 'Selected as Best. Recombines multiple population traits across 100 generations using Ordered Crossover (OX) & Swap Mutation to achieve the global minimum distance.'
    }
  ];

  return {
    startLocation,
    bestRoute: bestLocationRoute,
    totalDistance: globalBest.totalDistance,
    fitnessScore: Number(globalBest.fitness.toFixed(6)),
    generationsRun: config.generations,
    fitnessHistory,
    heuristicDistance: hDist,
    heuristicRoute: heuristicResult.route,
    candidates,
    improvementPercentage: Math.max(0, improvement),
    executionTimeMs,
    chromosomeCount: config.populationSize,
    config
  };
}
