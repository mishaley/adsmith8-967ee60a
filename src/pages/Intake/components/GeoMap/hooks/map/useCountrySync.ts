
import { useState, useEffect } from "react";
import mapboxgl from 'mapbox-gl';
import { highlightCountry } from './layers';

interface UseCountrySyncProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  selectedCountry: string;
  mapInitialized: boolean;
  layersInitialized: boolean;
}

/**
 * Hook to synchronize country selection between component state and map
 */
export const useCountrySync = ({
  map,
  selectedCountry,
  mapInitialized,
  layersInitialized
}: UseCountrySyncProps) => {
  const [lastHighlightAttempt, setLastHighlightAttempt] = useState<string | null>(null);

  // Effect to highlight the selected country when it changes (or clear it)
  useEffect(() => {
    if (mapInitialized && layersInitialized && map.current) {
      if (selectedCountry) {
        console.log(`Selected country changed to: ${selectedCountry}, highlighting on map`);
        highlightCountry(map.current, selectedCountry);
      } else {
        console.log('Clearing country selection on map');
        // Clear the highlight by passing empty string
        highlightCountry(map.current, '');
      }
      setLastHighlightAttempt(selectedCountry);
    }
  }, [selectedCountry, mapInitialized, layersInitialized, map]);

  return { lastHighlightAttempt };
};
