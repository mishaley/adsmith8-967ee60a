
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseClearCountrySelectionProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  initialized: boolean;
  selectedCountryId: string | null;
  setSelectedCountryId: (id: string | null) => void;
}

/**
 * Hook to handle clearing of country selection
 */
export const useClearCountrySelection = ({
  map,
  initialized,
  selectedCountryId,
  setSelectedCountryId
}: UseClearCountrySelectionProps) => {
  
  // Function to clear current country selection
  const clearCountrySelection = useCallback(() => {
    if (!map.current || !initialized) return;
    
    if (selectedCountryId) {
      console.log(`Clearing selection for country: ${selectedCountryId}`);
      
      // Find all features that might be selected
      const features = map.current.querySourceFeatures('countries-geojson');
      
      // Clear selection state from all features
      features.forEach(feature => {
        if (feature.id !== undefined) {
          map.current!.setFeatureState(
            { source: 'countries-geojson', id: feature.id },
            { selected: false }
          );
        }
      });
      
      setSelectedCountryId(null);
    }
  }, [map, initialized, selectedCountryId, setSelectedCountryId]);

  return { clearCountrySelection };
};
