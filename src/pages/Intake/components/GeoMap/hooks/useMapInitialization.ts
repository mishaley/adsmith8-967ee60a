
import { useState, useCallback, useEffect } from "react";
import { useMapInstance } from "./map/useMapInstance";
import { useDirectGeoJSONLayers } from "./map/useDirectGeoJSONLayers";
import { useCountryMappings } from "./map/useCountryMappings";
import { useSelectionSync } from "./map/useSelectionSync";
import { useMapRecovery } from "./map/useMapRecovery";
import { useSelectionRetry } from "./map/useSelectionRetry";
import { toast } from "sonner";

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

  // Load country ID to ISO code mappings
  const {
    countryIdToIsoMap,
    isoToCountryIdMap
  } = useCountryMappings();

  // Initialize map instance
  const {
    map,
    mapError: instanceError,
    initialized: mapInitialized
  } = useMapInstance({
    mapboxToken: mapboxToken || "",
    mapContainer
  });

  // Setup country selection handler
  const { handleCountrySelected } = useSelectionSync({
    isoToCountryIdMap,
    setSelectedCountry
  });

  // Set up direct GeoJSON approach for country layers
  const {
    initialized: layersInitialized,
    error: layersError,
    highlightCountry,
    clearCountrySelection
  } = useDirectGeoJSONLayers({
    map,
    onCountrySelected: handleCountrySelected
  });

  // Setup map recovery mechanism
  useMapRecovery({
    map,
    initialized,
    layersInitialized
  });

  // Set up selection retry mechanism
  useSelectionRetry({
    initialized,
    selectedCountry,
    setSelectedCountryId: highlightCountryFn
  });

  // Set the highlight function
  useEffect(() => {
    if (mapInitialized && layersInitialized) {
      setHighlightCountryFn(() => highlightCountry);
      setInitialized(true);
      
      console.log("Map fully initialized and ready for country selection");
    }
  }, [mapInitialized, layersInitialized, highlightCountry]);

  // Sync initialization errors
  useEffect(() => {
    if (instanceError) {
      setMapError(instanceError);
    } else if (layersError) {
      setMapError(layersError);
    } else {
      setMapError(null);
    }
  }, [instanceError, layersError]);

  // Apply country selection when it changes or map initializes
  useEffect(() => {
    if (initialized && highlightCountry) {
      if (selectedCountry) {
        console.log(`Applying country selection: ${selectedCountry}`);
        
        // Convert UUID to ISO code if needed
        const isoCode = countryIdToIsoMap[selectedCountry];
        
        if (isoCode) {
          console.log(`Converting UUID ${selectedCountry} to ISO code ${isoCode} for map`);
          highlightCountry(isoCode);
        } else {
          // Try using the selectedCountry directly (it might already be an ISO code)
          highlightCountry(selectedCountry);
        }
      } else {
        // Clear selection if selectedCountry is empty
        clearCountrySelection();
      }
    }
  }, [initialized, selectedCountry, highlightCountry, clearCountrySelection, countryIdToIsoMap]);

  // Display a notice if the map fails to load properly
  useEffect(() => {
    if (initialized && mapboxToken && mapContainer.current) {
      const mapHealthCheckTimer = setTimeout(() => {
        // Check if map container has any child elements
        if (mapContainer.current && (!mapContainer.current.firstChild || mapContainer.current.childNodes.length === 0)) {
          console.error("Map container is empty after initialization. Map failed to render.");
          toast.error("Map did not load properly. Please refresh the page.", {
            duration: 5000,
          });
        }
      }, 5000);
      
      return () => clearTimeout(mapHealthCheckTimer);
    }
  }, [initialized, mapboxToken, mapContainer]);

  return { 
    mapError, 
    initialized, 
    setSelectedCountryId: highlightCountryFn 
  };
};
