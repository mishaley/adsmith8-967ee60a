
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
      
      // Set up a retry mechanism
      let retryCount = 0;
      const maxRetries = 3;
      
      const attemptInitialization = () => {
        try {
          // Wait for map style to be fully loaded
          if (map.current?.isStyleLoaded()) {
            console.log("Map style already loaded, initializing layers now");
            initializeLayers(map.current);
          } else {
            // If style not loaded yet, wait for it
            console.log("Map style not loaded yet, setting up style.load event handler");
            map.current?.once('style.load', () => {
              console.log("Map style loaded event fired, initializing layers now");
              if (map.current) {
                initializeLayers(map.current);
              }
            });
            
            // Also set a timeout as a backup in case the event doesn't fire
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Setting retry timer (attempt ${retryCount}/${maxRetries})...`);
              setTimeout(() => {
                if (!layersInitialized && map.current) {
                  console.log(`Retry ${retryCount}: Attempting layer initialization again...`);
                  attemptInitialization();
                }
              }, 1000 * retryCount); // Incremental backoff
            }
          }
        } catch (innerErr) {
          console.error('Error in initialization attempt:', innerErr);
        }
      };
      
      // Initial attempt
      attemptInitialization();
      
    } catch (err) {
      console.error('Error initializing country layers:', err);
      setMapError(`Failed to initialize countries: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [map, mapboxToken, mapInitialized, initializeLayers, layersInitialized, setMapError]);
};
