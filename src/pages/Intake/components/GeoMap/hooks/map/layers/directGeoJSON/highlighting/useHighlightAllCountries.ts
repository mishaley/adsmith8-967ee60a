
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseHighlightAllCountriesProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  initialized: boolean;
  clearCountrySelection: () => void;
  clearExcludedCountry: () => void;
  setSelectedCountryId: (id: string | null) => void;
}

/**
 * Hook to handle highlighting all countries (worldwide option)
 */
export const useHighlightAllCountries = ({
  map,
  initialized,
  clearCountrySelection,
  clearExcludedCountry,
  setSelectedCountryId
}: UseHighlightAllCountriesProps) => {
  
  // Function to highlight all countries (worldwide option)
  const highlightAllCountries = useCallback(() => {
    if (!map.current || !initialized) {
      console.log("Cannot highlight all countries - map not ready");
      return;
    }
    
    console.log("Highlighting all countries (worldwide option)");
    
    try {
      // Clear any existing selection and exclusion
      clearCountrySelection();
      clearExcludedCountry();
      
      // Get all features from the source
      const features = map.current.querySourceFeatures('countries-geojson');
      console.log(`Found ${features.length} features to highlight for worldwide`);
      
      if (features.length === 0) {
        // If no features found, try again after a short delay
        setTimeout(() => {
          const retryFeatures = map.current?.querySourceFeatures('countries-geojson') || [];
          console.log(`Retry found ${retryFeatures.length} features`);
          
          // Set selected state for all features
          retryFeatures.forEach(feature => {
            if (feature.id !== undefined) {
              map.current!.setFeatureState(
                { source: 'countries-geojson', id: feature.id },
                { selected: true, excluded: false }
              );
            }
          });
          
          // Use a more brute force approach as last resort
          if (retryFeatures.length === 0 && map.current) {
            console.log("Using alternative approach for worldwide selection");
            const source = map.current.getSource('countries-geojson');
            if (source && 'setData' in source) {
              try {
                // Instead of trying to getData (which doesn't exist),
                // Mark all visible features as selected
                const allVisibleFeatures = map.current.queryRenderedFeatures({
                  layers: ['countries-fill']
                });
                
                console.log(`Source has ${allVisibleFeatures.length} visible features`);
                
                // Mark all features as selected
                allVisibleFeatures.forEach(feature => {
                  if (feature.id !== undefined) {
                    map.current!.setFeatureState(
                      { source: 'countries-geojson', id: feature.id },
                      { selected: true, excluded: false }
                    );
                  }
                });
              } catch (e) {
                console.error("Error in alternative worldwide selection:", e);
              }
            }
          }
        }, 1000);
      } else {
        // Set selected state for all features
        features.forEach(feature => {
          if (feature.id !== undefined) {
            map.current!.setFeatureState(
              { source: 'countries-geojson', id: feature.id },
              { selected: true, excluded: false }
            );
          }
        });
      }
      
      setSelectedCountryId("worldwide");
    } catch (error) {
      console.error("Error highlighting all countries:", error);
    }
  }, [map, initialized, clearCountrySelection, clearExcludedCountry, setSelectedCountryId]);

  return { highlightAllCountries };
};
