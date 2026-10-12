'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Layers } from 'lucide-react';
import { AlgorithmType, GAResult, Location } from '@/types/route';

interface OSMMapProps {
  result: GAResult;
  allLocations: Location[];
  activeAlgorithmId?: string;
  onSelectAlgorithm?: (id: AlgorithmType) => void;
}

export const OSMMap: React.FC<OSMMapProps> = ({
  result,
  allLocations,
  activeAlgorithmId = 'astar',
  onSelectAlgorithm
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const [showAllOverlay, setShowAllOverlay] = useState<boolean>(false);

  const { startLocation, algorithms, algorithmList } = result;
  const currentAlgo = algorithms ? algorithms[activeAlgorithmId as AlgorithmType] : null;

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Center coordinates
      const centerLat = startLocation.lat || 26.9124;
      const centerLon = startLocation.lon || 75.7873;

      // Create Leaflet map
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLon],
        zoom: 12,
        zoomControl: true,
        attributionControl: false
      });

      // Keyless, warm pastel OSM Humanitarian tile layer (no watermark, zero API key)
      L.tileLayer(
        'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c'],
          attribution: '© OpenStreetMap contributors'
        }
      ).addTo(map);

      const bounds: [number, number][] = [];

      // 1. Draw Polylines
      if (showAllOverlay && algorithmList && algorithmList.length > 0) {
        algorithmList.forEach((algo) => {
          const path = [startLocation, ...algo.route, startLocation];
          const coords: [number, number][] = path.map(loc => {
            const lat = loc.lat || centerLat;
            const lon = loc.lon || centerLon;
            bounds.push([lat, lon]);
            return [lat, lon];
          });

          const isCurrent = algo.id === activeAlgorithmId;

          L.polyline(coords, {
            color: algo.color,
            weight: isCurrent ? 5 : 2.5,
            opacity: isCurrent ? 0.95 : 0.45,
            dashArray: isCurrent ? undefined : '5, 7'
          }).addTo(map);
        });
      } else {
        const activeRoute = currentAlgo ? currentAlgo.route : result.bestRoute;
        const routeSequence = [startLocation, ...activeRoute, startLocation];
        const activeColor = currentAlgo?.id === 'ga' ? '#EC4899' : (currentAlgo ? currentAlgo.color : '#EC4899');

        const polylineCoords: [number, number][] = routeSequence.map(loc => {
          const lat = loc.lat || centerLat;
          const lon = loc.lon || centerLon;
          bounds.push([lat, lon]);
          return [lat, lon];
        });

        // Outer glow polyline (soft pink glow)
        L.polyline(polylineCoords, {
          color: '#F472B6',
          weight: 8,
          opacity: 0.35
        }).addTo(map);

        // Main polyline
        L.polyline(polylineCoords, {
          color: activeColor,
          weight: 4,
          dashArray: '6, 6',
          opacity: 0.95
        }).addTo(map);
      }

      // 2. Add Markers for Locations with Cute Pixel Pink Pins
      allLocations.forEach((loc, idx) => {
        const isStart = loc.id === startLocation.id;
        const lat = loc.lat || centerLat;
        const lon = loc.lon || centerLon;

        bounds.push([lat, lon]);

        const markerColor = isStart ? '#EC4899' : '#F472B6';
        const shadowColor = isStart ? 'rgba(236, 72, 153, 0.5)' : 'rgba(244, 114, 182, 0.5)';

        const customIcon = L.divIcon({
          className: 'custom-osm-marker',
          html: `
            <div style="
              background: ${markerColor};
              color: white;
              font-family: 'Pixelify Sans', 'Silkscreen', monospace;
              font-size: 11px;
              font-weight: 700;
              width: 28px;
              height: 28px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid white;
              box-shadow: 2px 2px 0px #BE185D, 0 0 10px ${shadowColor};
            ">
              ${isStart ? '★' : idx}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #831843; font-size: 12px; padding: 4px;">
            <strong style="color: #9D174D;">${loc.name}</strong> ${isStart ? '<span style="color:#EC4899;font-weight:bold;">(Start Origin)</span>' : ''}<br/>
            <span style="color: #6B7280; font-size: 10px; font-family: monospace;">${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}</span>
          </div>
        `;

        L.marker([lat, lon], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);
      });

      // Fit map bounds
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [45, 45] });
      }

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [result, allLocations, activeAlgorithmId, showAllOverlay]);

  return (
    <div className="pro-card p-6 rounded-2xl border-2 border-pink-200 bg-white shadow-[4px_4px_0px_#F472B6] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pink-100">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-pink-500" />
            <h3 className="text-sm font-pixel font-bold uppercase tracking-wider text-pink-950">
              Interactive Geographical Route Map
            </h3>
            <span
              className="px-2.5 py-0.5 rounded-md text-[10px] font-pixel text-pink-900 border-2 border-pink-300 bg-pink-50 shadow-[1px_1px_0px_#F472B6]"
            >
              Viewing: <strong style={{ color: currentAlgo?.color || '#DB2777' }}>{currentAlgo?.name || 'Optimal Route'}</strong>
            </span>
          </div>
          <p className="text-xs text-pink-700/80 mt-0.5 font-sans">
            Geocoded latitude/longitude coordinates rendered on light soothing OpenStreetMap canvas.
          </p>
        </div>

        {/* Multi-Algorithm Overlay Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAllOverlay(!showAllOverlay)}
            className={`px-3 py-1.5 rounded-xl text-xs font-pixel font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showAllOverlay
                ? 'bg-pink-500 text-white border-2 border-pink-600 shadow-[2px_2px_0px_#9D174D]'
                : 'pixel-btn text-pink-700 bg-pink-50 border-2 border-pink-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showAllOverlay ? 'All Routes Overlaid' : 'Overlay All Algorithms'}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="relative w-full h-[450px] rounded-xl border-2 border-pink-200 overflow-hidden shadow-inner bg-pink-50">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 border-2 border-pink-300 px-3.5 py-2.5 rounded-xl shadow-[3px_3px_0px_#F472B6] backdrop-blur-md text-xs space-y-1.5 max-w-xs">
          <div className="flex items-center gap-2 text-pink-950 font-pixel font-semibold text-[11px]">
            <span className="w-3.5 h-3.5 rounded-md bg-pink-500 border border-pink-600 text-white flex items-center justify-center text-[9px]">★</span>
            <span>Start Origin (Pink Star Marker)</span>
          </div>

          {showAllOverlay && algorithmList ? (
            <div className="pt-1.5 border-t border-pink-100 space-y-1">
              <span className="text-[10px] text-pink-700 uppercase font-pixel block">Algorithm Routes:</span>
              <div className="flex flex-wrap gap-1.5">
                {algorithmList.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onSelectAlgorithm && onSelectAlgorithm(a.id)}
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-pink-50 border border-pink-200 font-pixel text-zinc-700 cursor-pointer hover:bg-pink-100"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                    <span>{a.shortName}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-pink-950 font-pixel font-semibold text-[11px]">
              <span
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: currentAlgo?.color || '#EC4899' }}
              />
              <span>{currentAlgo?.shortName || 'Optimal'} Tour Path ({currentAlgo?.totalDistance} km)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
