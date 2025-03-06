
import { useCallback } from "react";
import mapboxgl from 'mapbox-gl';
import { highlightCountry } from './layers';

/**
 * Hook to handle map country highlighting
 * @param map Mapbox GL map instance
 * @param mapInitialized Flag indicating if the map is initialized
 * @returns Object with highlight function
 */
export const useMapHighlighting = (
  map: React.MutableRefObject<mapboxgl.Map | null>,
  mapInitialized: boolean
) => {
  // Function to highlight a country
  const highlightCountryOnMap = useCallback((countryId: string) => {
    if (!map.current || !mapInitialized) {
      console.log("Map not ready yet for highlighting countries");
      return;
    }
    
    console.log(`Highlighting country: ${countryId}`);
    highlightCountry(map.current, countryId);
  }, [map, mapInitialized]);

  return { highlightCountryOnMap };
};
