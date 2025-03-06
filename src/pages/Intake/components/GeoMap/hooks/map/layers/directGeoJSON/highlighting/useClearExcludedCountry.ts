
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseClearExcludedCountryProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  initialized: boolean;
  excludedCountryId: string | null;
  setExcludedCountryId: (id: string | null) => void;
}

/**
 * Hook to handle clearing of excluded country
 */
export const useClearExcludedCountry = ({
  map,
  initialized,
  excludedCountryId,
  setExcludedCountryId
}: UseClearExcludedCountryProps) => {
  
  // Function to clear excluded country
  const clearExcludedCountry = useCallback(() => {
    if (!map.current || !initialized) return;
    
    if (excludedCountryId) {
      console.log(`Clearing excluded country: ${excludedCountryId}`);
      
      // Find all features that might be excluded
      const features = map.current.querySourceFeatures('countries-geojson');
      
      // Clear excluded state from all features
      features.forEach(feature => {
        if (feature.id !== undefined) {
          map.current!.setFeatureState(
            { source: 'countries-geojson', id: feature.id },
            { excluded: false }
          );
        }
      });
      
      setExcludedCountryId(null);
    }
  }, [map, initialized, excludedCountryId, setExcludedCountryId]);

  return { clearExcludedCountry };
};
