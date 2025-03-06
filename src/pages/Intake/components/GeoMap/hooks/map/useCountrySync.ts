
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

  // Effect to highlight the selected country when it changes
  useEffect(() => {
    if (selectedCountry && mapInitialized && layersInitialized && map.current) {
      console.log(`Selected country changed to: ${selectedCountry}, highlighting on map`);
      highlightCountry(map.current, selectedCountry);
      setLastHighlightAttempt(selectedCountry);
    }
  }, [selectedCountry, mapInitialized, layersInitialized, map]);

  return { lastHighlightAttempt };
};
