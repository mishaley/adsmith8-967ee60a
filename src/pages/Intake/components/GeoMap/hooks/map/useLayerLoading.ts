
import { useEffect } from "react";
import mapboxgl from 'mapbox-gl';

interface UseLayerLoadingProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  mapboxToken: string | null;
  mapInitialized: boolean;
  layersInitialized: boolean;
  initializeLayers: (mapInstance: mapboxgl.Map) => void;
  setMapError: (error: string | null) => void;
}

/**
 * Hook to handle map layer loading
 */
export const useLayerLoading = ({
  map,
  mapboxToken,
  mapInitialized,
  layersInitialized,
  initializeLayers,
  setMapError
}: UseLayerLoadingProps) => {
  // Initialize country layers when map is ready
  useEffect(() => {
    if (!mapInitialized || !map.current || !mapboxToken || layersInitialized) {
      return;
    }

    try {
      console.log("Waiting for map to be ready before initializing layers...");
      
      // Wait for map style to be fully loaded
      if (map.current.isStyleLoaded()) {
        console.log("Map style already loaded, initializing layers now");
        initializeLayers(map.current);
      } else {
        // If style not loaded yet, wait for it
        console.log("Map style not loaded yet, setting up style.load event handler");
        map.current.on('style.load', () => {
          console.log("Map style loaded event fired, initializing layers now");
          if (map.current) {
            initializeLayers(map.current);
          }
        });
      }
    } catch (err) {
      console.error('Error initializing country layers:', err);
      setMapError(`Failed to initialize countries: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [map, mapboxToken, mapInitialized, initializeLayers, layersInitialized, setMapError]);
};
