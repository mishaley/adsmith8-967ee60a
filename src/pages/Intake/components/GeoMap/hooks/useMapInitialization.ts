
import { useState, useEffect, useCallback } from "react";
import { useMapInstance } from "./map/useMapInstance";
import mapboxgl from 'mapbox-gl';
import { 
  addCountrySource, 
  addCountryFillLayer, 
  addCountryBorderLayer,
  setupHoverEvents,
  setupClickEvents,
  highlightCountry
} from './map/layers';

interface UseMapInitializationProps {
  mapboxToken: string | null;
  mapContainer: React.RefObject<HTMLDivElement>;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

export const useMapInitialization = ({
  mapboxToken,
  mapContainer,
  selectedCountry,
  setSelectedCountry
}: UseMapInitializationProps) => {
  const [mapError, setMapError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [highlightCountryFn, setHighlightCountryFn] = useState<((id: string) => void) | null>(null);

  const {
    map,
    mapError: instanceError,
    initialized: mapInitialized
  } = useMapInstance({
    mapboxToken: mapboxToken || "",
    mapContainer
  });

  useEffect(() => {
    if (instanceError) {
      setMapError(instanceError);
    }
    setInitialized(mapInitialized);
  }, [instanceError, mapInitialized]);

  // Function to highlight a country
  const highlightCountryOnMap = useCallback((countryId: string) => {
    if (!map.current || !mapInitialized) {
      console.log("Map not ready yet for highlighting countries");
      return;
    }
    
    console.log(`Highlighting country: ${countryId}`);
    highlightCountry(map.current, countryId);
  }, [map, mapInitialized]);

  // Set the highlight function
  useEffect(() => {
    if (mapInitialized) {
      setHighlightCountryFn(() => highlightCountryOnMap);
    }
  }, [mapInitialized, highlightCountryOnMap]);

  // Initialize country layers
  useEffect(() => {
    if (!mapInitialized || !map.current || !mapboxToken) {
      return;
    }

    try {
      // Add source and layers
      addCountrySource(map.current);
      addCountryFillLayer(map.current);
      addCountryBorderLayer(map.current);
      setupHoverEvents(map.current);
      setupClickEvents(map.current, setSelectedCountry);
      
      console.log("Country layers initialized successfully");
    } catch (err) {
      console.error('Error initializing country layers:', err);
      setMapError(`Failed to initialize countries: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [map, mapboxToken, mapInitialized, setSelectedCountry]);

  // Effect to highlight the selected country when it changes
  useEffect(() => {
    if (selectedCountry && mapInitialized && map.current) {
      console.log(`Selected country changed to: ${selectedCountry}`);
      highlightCountry(map.current, selectedCountry);
    }
  }, [selectedCountry, mapInitialized, map]);

  return { mapError, initialized, setSelectedCountryId: highlightCountryFn };
};
