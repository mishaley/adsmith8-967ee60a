
import { useState, useEffect } from "react";
import { useMapInstance } from "./map/useMapInstance";
import { useCountryLayers } from "./map/useCountryLayers";
import mapboxgl from 'mapbox-gl';

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

  useEffect(() => {
    if (!mapInitialized || !map.current || !mapboxToken) {
      return;
    }

    const initCountryLayers = async () => {
      try {
        const { highlightCountry } = useCountryLayers({
          map: map.current as mapboxgl.Map,
          onCountryClick: setSelectedCountry
        });

        // Store the highlightCountry function to use in the outer scope
        setHighlightCountryFn(() => highlightCountry);

        // Initialize with any existing selection
        if (selectedCountry) {
          highlightCountry(selectedCountry);
        }
      } catch (err) {
        console.error('Error initializing country layers:', err);
        setMapError(`Failed to initialize countries: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    initCountryLayers();
  }, [map, mapboxToken, mapInitialized, selectedCountry, setSelectedCountry]);

  return { mapError, initialized, setSelectedCountryId: highlightCountryFn };
};
