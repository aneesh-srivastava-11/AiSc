import { Location } from '@/types/route';

/**
 * Calculates real-world Haversine distance between two sets of coordinates in Kilometers (km).
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Calculates Euclidean distance as a fallback.
 */
export function euclideanDistance(a: Location, b: Location): number {
  if (a.lat !== 0 && b.lat !== 0 && a.lon !== 0 && b.lon !== 0) {
    return haversineDistance(a.lat, a.lon, b.lat, b.lon);
  }
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates total route distance starting from `start`,
 * visiting all locations in `destinations` in order, and returning to `start`.
 * Distance returned in Kilometers (km).
 */
export function calculateTotalDistance(start: Location, destinations: Location[]): number {
  if (destinations.length === 0) return 0;

  let dist = 0;
  let current = start;

  for (const dest of destinations) {
    dist += euclideanDistance(current, dest);
    current = dest;
  }

  // Add distance returning back to start point
  dist += euclideanDistance(current, start);

  return Number(dist.toFixed(2));
}

/**
 * Queries OpenStreetMap Nominatim API for location lat/lon.
 */
export async function geocodeOSMLocation(name: string): Promise<{ lat: number; lon: number; formattedAddress?: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'Ai-ternary-TravelPlanner/1.0 (contact@aiternary.app)'
        }
      }
    );

    if (!response.ok) return null;
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        formattedAddress: data[0].display_name
      };
    }
  } catch (error) {
    console.warn(`OSM Geocoding warning for "${name}":`, error);
  }
  return null;
}

/**
 * Geocodes a list of location names via OpenStreetMap Nominatim API.
 * Uses fallback coordinate distribution if OSM is offline or rate-limited.
 */
export async function geocodeLocationsWithOSM(startName: string, destinationNames: string[]): Promise<Location[]> {
  const cleanStart = startName.trim();
  const cleanDests = destinationNames.map(d => d.trim()).filter(d => d.length > 0);

  const locations: Location[] = [];

  // Default coordinate seeds for known cities (Jaipur, Agra, etc.)
  const knownCoordinates: Record<string, { lat: number; lon: number; formattedAddress?: string }> = {
    'jaipur': { lat: 26.9124, lon: 75.7873 },
    'jaipur (start point)': { lat: 26.9124, lon: 75.7873 },
    'amer fort': { lat: 26.9855, lon: 75.8513 },
    'jal mahal': { lat: 26.9534, lon: 75.8462 },
    'hawa mahal': { lat: 26.9239, lon: 75.8267 },
    'city palace': { lat: 26.9258, lon: 75.8237 },
    'nahargarh fort': { lat: 26.9373, lon: 75.8155 },
    'agra fort (start)': { lat: 27.1795, lon: 78.0211 },
    'taj mahal': { lat: 27.1751, lon: 78.0421 },
    'mehtab bagh': { lat: 27.1799, lon: 78.0421 },
    'itimad-ud-daulah (baby taj)': { lat: 27.1929, lon: 78.0310 },
    'fatehpur sikri': { lat: 27.0945, lon: 77.6679 },
    'akbar tomb sikandra': { lat: 27.2206, lon: 77.9504 }
  };

  // 1. Geocode Start Location
  const startLower = cleanStart.toLowerCase();
  let startGeo = knownCoordinates[startLower] || await geocodeOSMLocation(cleanStart);

  if (!startGeo) {
    startGeo = { lat: 26.9124, lon: 75.7873 }; // Jaipur fallback center
  }

  locations.push({
    id: 'loc_start',
    name: cleanStart,
    lat: startGeo.lat,
    lon: startGeo.lon,
    x: 20,
    y: 50,
    category: 'landmark',
    formattedAddress: startGeo.formattedAddress
  });

  // 2. Geocode Destinations
  for (let i = 0; i < cleanDests.length; i++) {
    const name = cleanDests[i];
    const lowerName = name.toLowerCase();

    let destGeo = knownCoordinates[lowerName] || await geocodeOSMLocation(name);

    if (!destGeo) {
      // Offset slightly around start location if geocoding yields no result
      const angle = (i * (2 * Math.PI / cleanDests.length));
      const radius = 0.04 + (i * 0.01); // ~5km radius
      destGeo = {
        lat: startGeo.lat + radius * Math.cos(angle),
        lon: startGeo.lon + radius * Math.sin(angle)
      };
    }

    locations.push({
      id: `loc_${i + 1}`,
      name,
      lat: destGeo.lat,
      lon: destGeo.lon,
      x: Math.round(50 + 35 * Math.cos(i)),
      y: Math.round(50 + 35 * Math.sin(i)),
      category: assignCategory(name),
      formattedAddress: destGeo.formattedAddress
    });
  }

  return locations;
}

function assignCategory(name: string): Location['category'] {
  const lower = name.toLowerCase();
  if (lower.includes('fort') || lower.includes('garh') || lower.includes('castle')) return 'fort';
  if (lower.includes('palace') || lower.includes('mahal') || lower.includes('haveli')) return 'palace';
  if (lower.includes('temple') || lower.includes('mandir') || lower.includes('church') || lower.includes('mosque')) return 'temple';
  if (lower.includes('lake') || lower.includes('park') || lower.includes('garden') || lower.includes('zoo')) return 'nature';
  return 'landmark';
}
