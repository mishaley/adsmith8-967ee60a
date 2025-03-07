
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { forceMapUpdate } from './utils/viewportUtils';

interface UseMapRecoveryProps {
  map: mapboxgl.Map | null | undefined;
  initialized: boolean;
  layersInitialized: boolean;
}

/**
 * Hook to handle map recovery in case of rendering issues
 */
export const useMapRecovery = ({
  map,
  initialized,
  layersInitialized
}: UseMapRecoveryProps) => {
  useEffect(() => {
    if (!map || !initialized || !layersInitialized) return;
    
    // Force a map update to ensure everything is rendered properly
    console.log("Running map recovery check after initialization");
    
    const recoveryTimeout = setTimeout(() => {
      if (map) {
        console.log("Applying map recovery - forcing update");
        forceMapUpdate(map);
      }
    }, 1000);
    
    return () => clearTimeout(recoveryTimeout);
  }, [map, initialized, layersInitialized]);
};
