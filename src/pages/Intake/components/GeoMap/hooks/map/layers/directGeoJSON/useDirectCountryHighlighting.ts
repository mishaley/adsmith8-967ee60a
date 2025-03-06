
import { useState, useCallback, useEffect, useRef } from 'react';
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
  const lastAttemptedCountry = useRef<string | null>(null);
  const retryCount = useRef(0);

  // Function to clear current country selection - needs to be defined before it's used
  const clearCountrySelection = useCallback(() => {
    if (!map.current) return;
    
    try {
      if (selectedCountryId) {
        console.log(`Clearing selection for country: ${selectedCountryId}`);
      }
      
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
    } catch (error) {
      console.error("Error clearing country selection:", error);
    }
  }, [map, selectedCountryId]);

  // Helper function to scan all features and find a matching country
  const findFeatureByCountryCode = useCallback((countryId: string): number | null => {
    if (!map.current) return null;
    
    // Get all features from the source
    const features = map.current.querySourceFeatures('countries-geojson');
    console.log(`Scanning ${features.length} features to find country: ${countryId}`);
    
    // Match by any of the possible country code properties
    for (const feature of features) {
      const props = feature.properties;
      if (
        props.ISO_A2 === countryId || 
        props.ISO_A3 === countryId || 
        props.iso_a2 === countryId || 
        props.iso_a3 === countryId
      ) {
        return feature.id as number;
      }
    }
    
    return null;
  }, [map]);

  // Function to highlight a country programmatically
  const highlightCountry = useCallback((countryId: string) => {
    if (!map.current || !countryId) {
      console.log(`Cannot highlight country ${countryId} - map not ready or country ID empty`);
      return;
    }
    
    console.log(`Programmatically highlighting country: ${countryId}`);
    lastAttemptedCountry.current = countryId;
    retryCount.current = 0;
    
    // Clear any existing selection first
    clearCountrySelection();
    
    try {
      // Try to find the feature by ISO code using query
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
        
        // Set feature state to selected
        map.current.setFeatureState(
          { source: 'countries-geojson', id: featureId },
          { selected: true }
        );
        
        setSelectedCountryId(countryId);
      } else {
        console.log(`No features found for country code: ${countryId} with direct query`);
        
        // Try the manual scan approach
        const featureId = findFeatureByCountryCode(countryId);
        
        if (featureId !== null) {
          console.log(`Found feature with ID ${featureId} using full scan`);
          
          // Set feature state to selected
          map.current.setFeatureState(
            { source: 'countries-geojson', id: featureId },
            { selected: true }
          );
          
          setSelectedCountryId(countryId);
        } else {
          console.log(`No features found for country code: ${countryId} with full scan`);
          // Let the retry mechanism handle it
        }
      }
    } catch (error) {
      console.error(`Error highlighting country ${countryId}:`, error);
    }
  }, [map, clearCountrySelection, findFeatureByCountryCode]);

  // Automatic retry mechanism for selection
  useEffect(() => {
    if (!map.current || !initialized || !lastAttemptedCountry.current) return;
    
    // Set up retry timer to attempt selection again
    const retryTimer = setTimeout(() => {
      if (retryCount.current >= 3 || !lastAttemptedCountry.current || selectedCountryId) return;
      
      retryCount.current++;
      console.log(`Retry attempt ${retryCount.current}/3 for country: ${lastAttemptedCountry.current}`);
      
      // Try to highlight the country again
      try {
        const countryId = lastAttemptedCountry.current;
        
        // Try the manual scan approach
        const featureId = findFeatureByCountryCode(countryId);
        
        if (featureId !== null) {
          console.log(`Retry ${retryCount.current}: Found feature with ID ${featureId}`);
          
          // Set feature state to selected
          map.current!.setFeatureState(
            { source: 'countries-geojson', id: featureId },
            { selected: true }
          );
          
          setSelectedCountryId(countryId);
        } else {
          console.log(`Retry ${retryCount.current}: Still no feature found for ${countryId}`);
        }
      } catch (error) {
        console.error(`Error in retry ${retryCount.current}:`, error);
      }
    }, 1000 * retryCount.current); // Increase delay with each retry
    
    return () => clearTimeout(retryTimer);
  }, [map, initialized, selectedCountryId, findFeatureByCountryCode]);

  return {
    selectedCountryId,
    setSelectedCountryId,
    highlightCountry,
    clearCountrySelection
  };
};
