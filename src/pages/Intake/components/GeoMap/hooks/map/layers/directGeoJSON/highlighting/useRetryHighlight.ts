
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseRetryHighlightProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  initialized: boolean;
}

/**
 * Hook that provides a retry mechanism for highlighting countries
 */
export const useRetryHighlight = ({
  map,
  initialized
}: UseRetryHighlightProps) => {
  
  // Function to retry highlight with a full scan of features
  const retryHighlightWithFullScan = useCallback((
    countryId: string, 
    isExcluded: boolean = false,
    setSelectedCountryId: (id: string | null) => void,
    setExcludedCountryId: (id: string | null) => void
  ) => {
    if (!map.current || !initialized) return;
    
    console.log(`Retrying highlight with full scan for: ${countryId}, excluded: ${isExcluded}`);
    
    try {
      // Get all features from the source
      const allFeatures = map.current.querySourceFeatures('countries-geojson');
      
      // Manually search through all feature properties
      const matchingFeature = allFeatures.find(feature => {
        const props = feature.properties;
        return (
          props.ISO_A2 === countryId ||
          props.ISO_A3 === countryId ||
          props.iso_a2 === countryId ||
          props.iso_a3 === countryId
        );
      });
      
      if (matchingFeature) {
        const featureId = matchingFeature.id as number;
        
        console.log(`Full scan found feature with ID ${featureId} for country ${countryId}`);
        
        // Set feature state based on whether it's excluded or selected
        if (isExcluded) {
          map.current.setFeatureState(
            { source: 'countries-geojson', id: featureId },
            { excluded: true, selected: false }
          );
          setExcludedCountryId(countryId);
        } else {
          map.current.setFeatureState(
            { source: 'countries-geojson', id: featureId },
            { selected: true, excluded: false }
          );
          setSelectedCountryId(countryId);
        }
      } else {
        console.log(`Full scan found no features for country code: ${countryId}`);
      }
    } catch (error) {
      console.error(`Error in full scan for country ${countryId}:`, error);
    }
  }, [map, initialized]);

  return { retryHighlightWithFullScan };
};
