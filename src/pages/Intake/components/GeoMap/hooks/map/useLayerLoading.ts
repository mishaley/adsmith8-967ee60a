
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
 * Hook to handle map layer loading with enhanced reliability
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
      
      // Enhanced retry mechanism with more aggressive approach
      let retryCount = 0;
      const maxRetries = 8; // Increased max retries
      const initialRetryDelay = 300; // Start with a shorter initial delay
      
      const attemptInitialization = () => {
        try {
          if (!map.current) {
            console.log("Map reference lost during initialization attempt");
            return;
          }

          // First check: is the style loaded?
          if (map.current.isStyleLoaded()) {
            console.log("Map style already loaded, initializing layers now");
            
            // Add a small delay to ensure sources are fully ready
            setTimeout(() => {
              if (map.current) {
                initializeLayers(map.current);
                
                // Verify layers were added properly
                setTimeout(() => {
                  if (map.current && !layersInitialized) {
                    // Force a repaint which can help with rendering issues
                    const center = map.current.getCenter();
                    map.current.panTo([center.lng + 0.0001, center.lat]);
                    map.current.panTo(center);
                  }
                }, 100);
              }
            }, 200);
          } else {
            // If style not loaded yet, wait for it
            console.log("Map style not loaded yet, setting up style.load event handler");
            
            // Listen for the style.load event
            map.current.once('style.load', () => {
              console.log("Map style loaded event fired, initializing layers now");
              
              // Add a delay to ensure sources are fully ready
              setTimeout(() => {
                if (map.current) {
                  initializeLayers(map.current);
                  
                  // Force a repaint which can help with rendering issues
                  setTimeout(() => {
                    if (map.current && !layersInitialized) {
                      const center = map.current.getCenter();
                      map.current.panTo([center.lng + 0.0001, center.lat]);
                      map.current.panTo(center);
                    }
                  }, 100);
                }
              }, 200);
            });
            
            // Also set a timeout as a backup in case the event doesn't fire
            if (retryCount < maxRetries) {
              retryCount++;
              const retryDelay = initialRetryDelay * Math.pow(1.5, retryCount - 1); // Exponential backoff
              console.log(`Setting retry timer (attempt ${retryCount}/${maxRetries}) with delay ${retryDelay}ms...`);
              
              setTimeout(() => {
                if (!layersInitialized && map.current) {
                  console.log(`Retry ${retryCount}: Attempting layer initialization again...`);
                  attemptInitialization();
                }
              }, retryDelay);
            } else if (retryCount === maxRetries) {
              console.log("Maximum retries reached. Attempting direct initialization...");
              // Last resort: try to initialize even if style doesn't report as loaded
              if (map.current) {
                initializeLayers(map.current);
              }
            }
          }
        } catch (innerErr) {
          console.error('Error in initialization attempt:', innerErr);
          
          // If we still have retries left, try again
          if (retryCount < maxRetries) {
            retryCount++;
            const retryDelay = initialRetryDelay * Math.pow(1.5, retryCount - 1);
            console.log(`Error occurred, retrying (${retryCount}/${maxRetries}) in ${retryDelay}ms...`);
            setTimeout(attemptInitialization, retryDelay);
          } else {
            setMapError(`Failed to initialize map layers after multiple attempts: ${innerErr instanceof Error ? innerErr.message : String(innerErr)}`);
          }
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
