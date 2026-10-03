'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from 'lucide-react';
import { GAResult, Location } from '@/types/route';

interface OSMMapProps {
  result: GAResult;
  allLocations: Location[];
}

export const OSMMap: React.FC<OSMMapProps> = ({ result, allLocations }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const { startLocation, bestRoute } = result;
  const routeSequence = [startLocation, ...bestRoute, startLocation];

  useEffect(() => {
    let isMounted = true;

    // Load Leaflet dynamically on client side
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Center coords
      const centerLat = startLocation.lat || 26.9124;
      const centerLon = startLocation.lon || 75.7873;

      // Create Leaflet map instance
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLon],
        zoom: 12,
        zoomControl: true,
        attributionControl: false
      });

      // KEYLESS Dark Tile Provider: Esri World Dark Gray Canvas (100% Keyless, zero watermarks)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: 'Esri, HERE, Garmin, © OpenStreetMap contributors'
      }).addTo(map);

      // Collect lat/lon bounds for auto-fit
      const bounds: [number, number][] = [];

      // 1. Draw Route Polyline
      const polylineCoords: [number, number][] = routeSequence.map(loc => {
        const lat = loc.lat || centerLat;
        const lon = loc.lon || centerLon;
        bounds.push([lat, lon]);
        return [lat, lon];
      });

      // Outer glow line
      L.polyline(polylineCoords, {
        color: '#0EA5E9',
        weight: 6,
        opacity: 0.35
      }).addTo(map);

      // Main route polyline
      L.polyline(polylineCoords, {
        color: '#10B981',
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.95
      }).addTo(map);

      // 2. Add Markers for Locations
      allLocations.forEach((loc, idx) => {
        const isStart = loc.id === startLocation.id;
        const lat = loc.lat || centerLat;
        const lon = loc.lon || centerLon;

        // Custom HTML Marker Icon
        const customIcon = L.divIcon({
          className: 'custom-osm-marker',
          html: `
            <div style="
              background: ${isStart ? '#10B981' : '#0EA5E9'};
              color: white;
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              font-weight: 700;
              width: 26px;
              height: 26px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid #09090B;
              box-shadow: 0 0 10px ${isStart ? 'rgba(16, 185, 129, 0.6)' : 'rgba(14, 165, 233, 0.6)'};
            ">
              ${isStart ? 'S' : idx}
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; color: #09090B; font-size: 12px; padding: 2px;">
            <strong>${loc.name}</strong> ${isStart ? '(Start Point)' : ''}<br/>
            <span style="color: #64748B; font-size: 10px;">${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}</span>
          </div>
        `;

        L.marker([lat, lon], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);
      });

      // Fit map bounds to view all route markers cleanly
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40] });
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
  }, [result, allLocations]);

  return (
    <div className="pro-card p-6 rounded-2xl border border-zinc-800 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-sky-400" />
            Interactive Keyless Geographical Route Map
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Geocoded latitude/longitude coordinates rendered on Keyless OpenStreetMap Dark Canvas.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span>Live Keyless OSM Layer</span>
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="relative w-full h-[450px] rounded-xl border border-zinc-800 overflow-hidden shadow-2xl bg-zinc-950">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-zinc-900/95 border border-zinc-800 px-3.5 py-2.5 rounded-xl shadow-xl backdrop-blur-md text-xs space-y-1">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span>Start Origin (Green Marker)</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <span className="w-3 h-3 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
            <span>Destination Sequence (Sky Markers)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
