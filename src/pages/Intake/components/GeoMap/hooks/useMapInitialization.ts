
import { useState, useCallback, useEffect } from "react";
import { useMapInstance } from "./map/useMapInstance";
import { useMapHighlighting } from "./map/useMapHighlighting";
import { useLayerInitialization } from "./map/useLayerInitialization";
import { useLayerLoading } from "./map/useLayerLoading";
import { useCountrySync } from "./map/useCountrySync";

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

  // Initialize map instance
  const {
    map,
    mapError: instanceError,
    initialized: mapInitialized
  } = useMapInstance({
    mapboxToken: mapboxToken || "",
    mapContainer
  });

  // Initialize layer management
  const {
    layersInitialized,
    initializeLayers
  } = useLayerInitialization(map, setSelectedCountry);

  // Setup map highlighting functionality
  const { highlightCountryOnMap } = useMapHighlighting(map, mapInitialized);

  // Handle layer loading
  useLayerLoading({
    map,
    mapboxToken,
    mapInitialized,
    layersInitialized,
    initializeLayers,
    setMapError
  });

  // Synchronize country selection with map
  const { lastHighlightAttempt } = useCountrySync({
    map,
    selectedCountry,
    mapInitialized,
    layersInitialized
  });

  // Sync initialization errors
  useEffect(() => {
    if (instanceError) {
      setMapError(instanceError);
    }
    
    // Set overall initialization state
    setInitialized(mapInitialized && layersInitialized);
  }, [instanceError, mapInitialized, layersInitialized]);

  // Set the highlight function
  useEffect(() => {
    if (mapInitialized) {
      setHighlightCountryFn(() => highlightCountryOnMap);
    }
  }, [mapInitialized, highlightCountryOnMap]);

  return { 
    mapError, 
    initialized: mapInitialized && layersInitialized, 
    setSelectedCountryId: highlightCountryFn 
  };
};
