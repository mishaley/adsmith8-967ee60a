
import { useState, useCallback, useEffect } from "react";
import { useMapInstance } from "./map/useMapInstance";
import { useMapHighlighting } from "./map/useMapHighlighting";
import { useLayerInitialization } from "./map/useLayerInitialization";
import { useLayerLoading } from "./map/useLayerLoading";
import { useCountrySync } from "./map/useCountrySync";
import { convertIsoToCountryId } from "./map/layers/utils/countryIdUtils";

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
  } = useLayerInitialization(map, async (isoCode) => {
    console.log(`Country clicked on map, ISO code: ${isoCode}`);
    
    if (!isoCode) {
      console.log("Clearing country selection");
      setSelectedCountry("");
      return;
    }
    
    try {
      // Convert ISO code to country_id for the UI dropdown
      const countryId = await convertIsoToCountryId(isoCode);
      
      if (countryId) {
        console.log(`Setting selected country to: ${countryId}`);
        setSelectedCountry(countryId);
      } else {
        console.log(`Could not convert ISO ${isoCode} to country_id`);
        // Use the ISO code directly if we can't convert it
        setSelectedCountry(isoCode);
      }
    } catch (error) {
      console.error("Error processing map country selection:", error);
      // Still try to set the country even if there was an error
      setSelectedCountry(isoCode);
    }
  });

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

  // Enhanced country selection retry mechanism
  useEffect(() => {
    if (initialized && selectedCountry) {
      console.log(`Applying country selection: ${selectedCountry}`);
      
      // Initial application
      if (highlightCountryFn) {
        highlightCountryFn(selectedCountry);
      }
      
      // Additional retry after a short delay to handle race conditions
      const retryTimer = setTimeout(() => {
        if (highlightCountryFn) {
          console.log(`Retrying country highlighting for: ${selectedCountry}`);
          highlightCountryFn(selectedCountry);
        }
      }, 500);
      
      return () => clearTimeout(retryTimer);
    }
  }, [initialized, selectedCountry, highlightCountryFn]);

  return { 
    mapError, 
    initialized: mapInitialized && layersInitialized, 
    setSelectedCountryId: highlightCountryFn 
  };
};
