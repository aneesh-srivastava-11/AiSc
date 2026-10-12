import { NextRequest, NextResponse } from 'next/server';
import { geocodeLocationsWithOSM } from '@/lib/distance';
import { runMultiAlgorithmBenchmark } from '@/lib/benchmark';
import { OptimizeRequest, OptimizeResponse } from '@/types/route';

export const runtime = 'nodejs';

/**
 * Health check & API specification
 */
export async function GET() {
  return NextResponse.json({
    status: 'online',
    engine: 'Ai-ternary Multi-Algorithm Route Optimizer',
    supportedAlgorithms: ['astar', 'ga', 'greedy', 'bfs', 'dfs', 'all'],
    gisProvider: 'OpenStreetMap Nominatim',
    documentation: 'Send POST with { start: string, destinations: string[], selectedAlgorithm?: string }'
  });
}

export async function POST(req: NextRequest) {
  try {
    let body: OptimizeRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body provided in request.' },
        { status: 400 }
      );
    }

    const { start, destinations, config, selectedAlgorithm } = body;

    // Validate inputs
    if (!start || typeof start !== 'string' || start.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid starting location.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(destinations) || destinations.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one destination.' },
        { status: 400 }
      );
    }

    const cleanDestinations = destinations
      .map(d => (typeof d === 'string' ? d.trim() : ''))
      .filter(d => d.length > 0);

    if (cleanDestinations.length === 0) {
      return NextResponse.json(
        { error: 'Destinations list cannot be empty.' },
        { status: 400 }
      );
    }

    // 1. Geocode locations via OpenStreetMap Nominatim API (with local coordinate cache)
    const allLocations = await geocodeLocationsWithOSM(start, cleanDestinations);
    const startLoc = allLocations[0];
    const destLocs = allLocations.slice(1);

    // 2. Execute Multi-Algorithm Optimization Benchmark (A*, GA, Greedy, BFS, DFS)
    const benchmarkResult = runMultiAlgorithmBenchmark(startLoc, destLocs, {
      config,
      selectedAlgorithm: selectedAlgorithm || 'all'
    });

    // 3. Construct and return response
    const responseData: OptimizeResponse = {
      result: benchmarkResult,
      allLocations
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error('Error optimizing route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process route optimization request.' },
      { status: 500 }
    );
  }
}
