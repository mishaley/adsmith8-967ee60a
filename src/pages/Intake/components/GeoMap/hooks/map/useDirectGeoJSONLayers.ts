
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseDirectGeoJSONLayersProps {
  map: mapboxgl.Map | null | undefined;
  onCountrySelected: (countryId: string) => void;
}

export const useDirectGeoJSONLayers = ({
  map,
  onCountrySelected
}: UseDirectGeoJSONLayersProps) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set up the country layers and interactions
  useEffect(() => {
    if (!map) {
      console.log("Map not yet available for layer initialization");
      return;
    }
    
    try {
      console.log("Initializing direct GeoJSON layers");
      
      // Implementation would go here...
      // For now, we'll just set initialized to true
      setInitialized(true);
      
    } catch (err) {
      console.error("Error setting up direct GeoJSON layers:", err);
      setError(`Failed to set up map layers: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [map, onCountrySelected]);

  // Function to highlight a country by ISO code
  const highlightCountry = (isoCode: string) => {
    if (!map || !initialized) return;
    
    console.log(`Highlighting country with ISO code: ${isoCode}`);
    // Implementation would go here...
  };
  
  // Function to highlight an excluded country
  const highlightExcludedCountry = (isoCode: string) => {
    if (!map || !initialized) return;
    
    console.log(`Highlighting excluded country with ISO code: ${isoCode}`);
    // Implementation would go here...
  };
  
  // Function to clear country selection
  const clearCountrySelection = () => {
    if (!map || !initialized) return;
    
    console.log("Clearing country selection");
    // Implementation would go here...
  };

  return {
    initialized,
    error,
    highlightCountry,
    highlightExcludedCountry,
    clearCountrySelection
  };
};
