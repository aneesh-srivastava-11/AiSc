import { NextRequest, NextResponse } from 'next/server';
import { geocodeLocationsWithOSM } from '@/lib/distance';
import { runGeneticAlgorithm } from '@/lib/genetic';
import { OptimizeRequest, OptimizeResponse } from '@/types/route';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body: OptimizeRequest = await req.json();
    const { start, destinations, config } = body;

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

    // 1. Geocode locations via OpenStreetMap Nominatim API
    const allLocations = await geocodeLocationsWithOSM(start, cleanDestinations);
    const startLoc = allLocations[0];
    const destLocs = allLocations.slice(1);

    // 2. Execute Genetic Algorithm Optimization
    const gaResult = runGeneticAlgorithm(startLoc, destLocs, config);

    // 3. Construct and return response
    const responseData: OptimizeResponse = {
      result: gaResult,
      allLocations
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Error optimizing route:', error);
    return NextResponse.json(
      { error: 'Failed to process route optimization request.' },
      { status: 500 }
    );
  }
}
