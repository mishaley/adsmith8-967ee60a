
import { useEffect } from "react";
import { toast } from "sonner";

interface UseMapRecoveryProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  initialized: boolean;
  layersInitialized: boolean;
}

/**
 * Hook to handle map initialization recovery mechanisms
 */
export const useMapRecovery = ({
  map,
  initialized,
  layersInitialized
}: UseMapRecoveryProps) => {
  
  // Recovery mechanism if the map fails to initialize properly
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const checkInitialization = () => {
      if (!initialized && retryCount < maxRetries) {
        console.log(`Map initialization check (attempt ${retryCount + 1}/${maxRetries})`);
        
        if (map.current && !layersInitialized) {
          retryCount++;
          console.log(`Map exists but layers not initialized. Forcing refresh attempt ${retryCount}`);
          
          // Try to force map refresh
          const center = map.current.getCenter();
          map.current.setCenter([center.lng + 0.1, center.lat]);
          setTimeout(() => {
            if (map.current) {
              map.current.setCenter(center);
            }
          }, 100);
          
          // Check again after a delay
          setTimeout(checkInitialization, 3000);
          
          // If this is the last retry, show a toast to the user
          if (retryCount === maxRetries) {
            toast.info("Refreshing map...", {
              duration: 2000,
            });
          }
        }
      }
    };
    
    // Start checking after a delay
    const initialCheckTimer = setTimeout(checkInitialization, 5000);
    
    return () => {
      clearTimeout(initialCheckTimer);
    };
  }, [map, initialized, layersInitialized]);
};
