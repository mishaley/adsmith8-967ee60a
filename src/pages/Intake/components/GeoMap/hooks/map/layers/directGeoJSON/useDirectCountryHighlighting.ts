
import { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseDirectCountryHighlightingProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  initialized: boolean;
}

export const useDirectCountryHighlighting = ({
  map,
  initialized
}: UseDirectCountryHighlightingProps) => {
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [excludedCountryId, setExcludedCountryId] = useState<string | null>(null);

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
  }, [map, initialized, selectedCountryId]);

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
  }, [map, initialized, excludedCountryId]);

  // Function to retry highlight with a full scan of features
  const retryHighlightWithFullScan = useCallback((countryId: string, isExcluded: boolean = false) => {
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
              const data = (source as mapboxgl.GeoJSONSource).getData();
              if (data && 'features' in data) {
                const geoData = data as GeoJSON.FeatureCollection;
                console.log(`Source has ${geoData.features.length} features`);
                
                // Mark all features as selected in the data
                geoData.features.forEach((feature, index) => {
                  map.current!.setFeatureState(
                    { source: 'countries-geojson', id: index },
                    { selected: true, excluded: false }
                  );
                });
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
  }, [map, initialized, clearCountrySelection, clearExcludedCountry]);

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
          retryHighlightWithFullScan(countryId, isExcluded);
        }, 500);
      }
    } catch (error) {
      console.error(`Error highlighting country ${countryId}:`, error);
    }
  }, [map, initialized, clearCountrySelection, clearExcludedCountry, retryHighlightWithFullScan, highlightAllCountries, selectedCountryId, excludedCountryId]);

  // Function to highlight a country as excluded
  const highlightExcludedCountry = useCallback((countryId: string) => {
    highlightCountry(countryId, true);
  }, [highlightCountry]);

  return {
    selectedCountryId,
    setSelectedCountryId,
    excludedCountryId,
    setExcludedCountryId,
    highlightCountry,
    highlightExcludedCountry,
    clearCountrySelection,
    clearExcludedCountry,
    highlightAllCountries
  };
};
