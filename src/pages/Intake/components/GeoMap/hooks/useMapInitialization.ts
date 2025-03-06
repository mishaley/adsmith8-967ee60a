
import { useState, useCallback, useEffect } from "react";
import { useMapInstance } from "./map/useMapInstance";
import { useDirectGeoJSONLayers } from "./map/useDirectGeoJSONLayers";
import { convertIsoToCountryId } from "./map/layers/utils/countryIdUtils";
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

  // Initialize map instance
  const {
    map,
    mapError: instanceError,
    initialized: mapInitialized
  } = useMapInstance({
    mapboxToken: mapboxToken || "",
    mapContainer
  });

  // Set up new direct GeoJSON approach for country layers
  const {
    initialized: layersInitialized,
    error: layersError,
    highlightCountry,
    clearCountrySelection
  } = useDirectGeoJSONLayers({
    map,
    onCountrySelected: async (isoCode) => {
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
    }
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
        highlightCountry(selectedCountry);
        
        // Additional retry for reliability
        setTimeout(() => {
          if (highlightCountry) {
            console.log(`Retry: Applying country selection: ${selectedCountry}`);
            highlightCountry(selectedCountry);
          }
        }, 1000);
      } else {
        // Clear selection if selectedCountry is empty
        clearCountrySelection();
      }
    }
  }, [initialized, selectedCountry, highlightCountry, clearCountrySelection]);

  // Recovery mechanism if the map fails to initialize properly
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const checkInitialization = () => {
      if (!initialized && retryCount < maxRetries) {
        console.log(`Map initialization check (attempt ${retryCount + 1}/${maxRetries})`);
        
        if (map.current && !layersInitialized) {
          retryCount++;
          console.log(`Map exists but layers not initialized. Forcing refresh attempt ${retryCount}`);
          
          // Try to force map refresh
          const center = map.current.getCenter();
          map.current.setCenter([center.lng + 0.1, center.lat]);
          setTimeout(() => {
            if (map.current) {
              map.current.setCenter(center);
            }
          }, 100);
          
          // Check again after a delay
          setTimeout(checkInitialization, 3000);
          
          // If this is the last retry, show a toast to the user
          if (retryCount === maxRetries) {
            toast.info("Refreshing map...", {
              duration: 2000,
            });
          }
        }
      }
    };
    
    // Start checking after a delay
    const initialCheckTimer = setTimeout(checkInitialization, 5000);
    
    return () => {
      clearTimeout(initialCheckTimer);
    };
  }, [map, initialized, layersInitialized]);

  return { 
    mapError, 
    initialized, 
    setSelectedCountryId: highlightCountryFn 
  };
};
