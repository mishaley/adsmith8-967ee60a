
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseHighlightCountryProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  initialized: boolean;
  clearCountrySelection: () => void;
  clearExcludedCountry: () => void;
  selectedCountryId: string | null;
  excludedCountryId: string | null;
  setSelectedCountryId: (id: string | null) => void;
  setExcludedCountryId: (id: string | null) => void;
  retryHighlightWithFullScan: (
    countryId: string, 
    isExcluded: boolean,
    setSelectedCountryId: (id: string | null) => void,
    setExcludedCountryId: (id: string | null) => void
  ) => void;
  highlightAllCountries: () => void;
}

/**
 * Hook to handle highlighting a country
 */
export const useHighlightCountry = ({
  map,
  initialized,
  clearCountrySelection,
  clearExcludedCountry,
  selectedCountryId,
  excludedCountryId,
  setSelectedCountryId,
  setExcludedCountryId,
  retryHighlightWithFullScan,
  highlightAllCountries
}: UseHighlightCountryProps) => {
  
  // Function to highlight a country programmatically
  const highlightCountry = useCallback((countryId: string, isExcluded: boolean = false) => {
    if (!map.current || !initialized || !countryId) {
      console.log(`Cannot highlight country ${countryId} - map not ready or country ID empty`);
      return;
    }
    
    // Special case for worldwide option
    if (countryId === "worldwide" && !isExcluded) {
      highlightAllCountries();
      return;
    }
    
    console.log(`Programmatically highlighting country: ${countryId}, excluded: ${isExcluded}`);
    
    // If we're setting an excluded country
    if (isExcluded) {
      // Clear any previous excluded country
      clearExcludedCountry();
      
      // If this country was previously selected, clear that selection
      if (selectedCountryId === countryId) {
        clearCountrySelection();
      }
    } else {
      // For regular selection, clear any existing selection
      clearCountrySelection();
      
      // If this country was previously excluded, clear that exclusion
      if (excludedCountryId === countryId) {
        clearExcludedCountry();
      }
    }
    
    try {
      // Find the feature by ISO code
      const features = map.current.querySourceFeatures('countries-geojson', {
        filter: [
          'any',
          ['==', ['get', 'ISO_A2'], countryId],
          ['==', ['get', 'ISO_A3'], countryId],
          ['==', ['get', 'iso_a2'], countryId],
          ['==', ['get', 'iso_a3'], countryId]
        ]
      });
      
      if (features.length > 0) {
        const feature = features[0];
        const featureId = feature.id as number;
        
        console.log(`Found feature with ID ${featureId} for country ${countryId}`);
        
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
        console.log(`No features found for country code: ${countryId}`);
        
        // Retry with a more expensive search as fallback
        setTimeout(() => {
          retryHighlightWithFullScan(countryId, isExcluded, setSelectedCountryId, setExcludedCountryId);
        }, 500);
      }
    } catch (error) {
      console.error(`Error highlighting country ${countryId}:`, error);
    }
  }, [
    map, 
    initialized, 
    clearCountrySelection, 
    clearExcludedCountry, 
    retryHighlightWithFullScan, 
    highlightAllCountries, 
    selectedCountryId, 
    excludedCountryId,
    setSelectedCountryId,
    setExcludedCountryId
  ]);

  // Function to highlight a country as excluded
  const highlightExcludedCountry = useCallback((countryId: string) => {
    highlightCountry(countryId, true);
  }, [highlightCountry]);

  return {
    highlightCountry,
    highlightExcludedCountry
  };
};
