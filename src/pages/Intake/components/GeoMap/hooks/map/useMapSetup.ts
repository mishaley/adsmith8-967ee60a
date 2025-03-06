
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { applyMapStyling } from './utils/mapStylingUtils';
import { adjustMapView } from './utils/viewportUtils';

interface UseMapSetupProps {
  mapboxToken: string;
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.MutableRefObject<mapboxgl.Map | null>;
  containerWidth: number;
  setInitialized: (value: boolean) => void;
  setMapError: (error: string | null) => void;
}

/**
 * Hook to handle map initialization setup
 */
export const useMapSetup = ({
  mapboxToken,
  mapContainer,
  map,
  containerWidth,
  setInitialized,
  setMapError
}: UseMapSetupProps) => {
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) {
      console.log("Map initialization skipped:", {
        containerExists: !!mapContainer.current,
        tokenExists: !!mapboxToken,
        tokenLength: mapboxToken ? mapboxToken.length : 0,
        mapAlreadyInitialized: !!map.current
      });
      return;
    }
    
    console.log("Initializing map with token:", 
      mapboxToken.length > 10 
        ? `${mapboxToken.substring(0, 5)}...${mapboxToken.substring(mapboxToken.length - 5)}`
        : "Invalid token (too short)");
    
    try {
      setMapError(null);
      
      mapboxgl.accessToken = mapboxToken;
      
      console.log("Creating map instance");
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 1,
        center: [0, 8], // Center point at latitude 8
        projection: {
          name: 'mercator',
          center: [0, 8], // Matching center point with the map center
          parallels: [0, 60]
        },
        minZoom: 0.5,
        maxZoom: 8,
        maxBounds: [
          [-180, -56], // Southwest corner
          [180, 81]    // Northeast corner
        ],
        renderWorldCopies: false,
        attributionControl: false,
        preserveDrawingBuffer: true,
        interactive: true,         // Ensure map interaction is enabled
        doubleClickZoom: false     // Disable double-click zoom to avoid conflicts with click selection
      });

      map.current.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        'bottom-right'
      );

      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );

      map.current.on('load', () => {
        console.log("Map loaded event fired");
        
        if (map.current) {
          applyMapStyling(map.current);
        }

        setInitialized(true);

        if (map.current && mapContainer.current) {
          adjustMapView(map.current, mapContainer.current.offsetWidth);
        }
      });

      map.current.on('error', (e) => {
        console.error("Mapbox error:", e.error);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });
      
      // Add debugging for click events
      map.current.on('click', (e) => {
        console.log("Map click detected at coordinates:", e.lngLat);
      });
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError(`Failed to initialize map: ${err instanceof Error ? err.message : String(err)}`);
    }

    return () => {
      if (map.current) {
        console.log("Cleaning up map instance");
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, mapContainer, containerWidth, setInitialized, setMapError]);
};
