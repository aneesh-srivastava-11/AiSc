import { Chromosome, GAConfig, GAResult, GenerationStat, Location } from '@/types/route';
import { orderedCrossover } from './crossover';
import { preserveElites } from './elitism';
import { runNearestNeighborHeuristic } from './heuristic';
import { swapMutate } from './mutation';
import { initializePopulation } from './population';
import { tournamentSelection } from './selection';

const DEFAULT_CONFIG: GAConfig = {
  populationSize: 100,
  generations: 100,
  tournamentSize: 5,
  mutationRate: 0.05,
  eliteCount: 5
};

/**
 * MAIN GENETIC ALGORITHM EXECUTION ENGINE
 * 
 * Pipeline:
 * 1. Initialize Population (100 Chromosomes, 1 Seeded by NN Heuristic, 99 Random Permutations)
 * 2. Evaluate Fitness (Fitness = 1 / Total Distance)
 * 3. Loop for `generations` (100 iterations):
 *    a. Record generation statistics (best distance, best fitness, avg fitness)
 *    b. Apply Elitism (preserve top 5 chromosomes directly)
 *    c. Select Parents via Tournament Selection (k=5)
 *    d. Apply Ordered Crossover (OX) to generate offspring
 *    e. Apply Swap Mutation (rate = 5%)
 *    f. Construct Next Generation
 * 4. Return Best Route, Fitness, History Chart Data, and Heuristic Comparison Metrics.
 */
export function runGeneticAlgorithm(
  startLocation: Location,
  destinations: Location[],
  userConfig?: Partial<GAConfig>
): GAResult {
  const startTime = performance.now();
  const config: GAConfig = { ...DEFAULT_CONFIG, ...userConfig };

  const locationMap = new Map<string, Location>();
  destinations.forEach(d => locationMap.set(d.id, d));

  // Run NN Heuristic Baseline
  const heuristicResult = runNearestNeighborHeuristic(startLocation, destinations);

  // If 0 or 1 destination, return immediately
  if (destinations.length <= 1) {
    const totalDist = destinations.length === 1 ? heuristicResult.chromosome.totalDistance : 0;
    const fit = destinations.length === 1 ? heuristicResult.chromosome.fitness : 1;

    return {
      startLocation,
      bestRoute: [...destinations],
      totalDistance: totalDist,
      fitnessScore: fit,
      generationsRun: 0,
      fitnessHistory: [{ generation: 0, bestFitness: fit, bestDistance: totalDist, avgFitness: fit }],
      heuristicDistance: totalDist,
      heuristicRoute: [...destinations],
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
    // Sort population descending by fitness
    population.sort((a, b) => b.fitness - a.fitness);

    const currentBest = population[0];
    if (currentBest.fitness > globalBest.fitness) {
      globalBest = { ...currentBest };
    }

    // Record generation stats
    const avgFit = population.reduce((sum, c) => sum + c.fitness, 0) / population.length;
    fitnessHistory.push({
      generation: gen,
      bestFitness: currentBest.fitness,
      bestDistance: currentBest.totalDistance,
      avgFitness: avgFit
    });

    // Step 2a: Elitism
    const nextGeneration: Chromosome[] = preserveElites(population, config.eliteCount);

    // Step 2b: Crossover & Mutation until population is filled
    while (nextGeneration.length < config.populationSize) {
      const parentA = tournamentSelection(population, config.tournamentSize);
      const parentB = tournamentSelection(population, config.tournamentSize);

      // Ordered Crossover (OX)
      let offspring = orderedCrossover(parentA, parentB, startLocation, locationMap);

      // Swap Mutation
      offspring = swapMutate(offspring, config.mutationRate, startLocation, locationMap);

      nextGeneration.push(offspring);
    }

    population = nextGeneration;
  }

  // Final evaluation of global best chromosome
  const bestLocationRoute: Location[] = globalBest.genes
    .map(id => locationMap.get(id))
    .filter((loc): loc is Location => loc !== undefined);

  const endTime = performance.now();
  const executionTimeMs = Number((endTime - startTime).toFixed(2));

  // Calculate improvement percentage over NN Heuristic
  const hDist = heuristicResult.chromosome.totalDistance;
  const gDist = globalBest.totalDistance;
  const improvement = hDist > 0 ? Number((((hDist - gDist) / hDist) * 100).toFixed(2)) : 0;

  return {
    startLocation,
    bestRoute: bestLocationRoute,
    totalDistance: globalBest.totalDistance,
    fitnessScore: Number(globalBest.fitness.toFixed(6)),
    generationsRun: config.generations,
    fitnessHistory,
    heuristicDistance: hDist,
    heuristicRoute: heuristicResult.route,
    improvementPercentage: Math.max(0, improvement),
    executionTimeMs,
    chromosomeCount: config.populationSize,
    config
  };
}
