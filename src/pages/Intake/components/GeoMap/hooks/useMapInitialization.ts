
import { useState, useCallback, useEffect } from "react";
import { useMapInstance } from "./map/useMapInstance";
import { useDirectGeoJSONLayers } from "./map/useDirectGeoJSONLayers";
import { convertIsoToCountryId } from "./map/layers/utils/countryIdUtils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [countryIdToIsoMap, setCountryIdToIsoMap] = useState<Record<string, string>>({});
  const [isoToCountryIdMap, setIsoToCountryIdMap] = useState<Record<string, string>>({});

  // Load country mappings once
  useEffect(() => {
    const loadCountryMappings = async () => {
      try {
        const { data, error } = await supabase
          .from('y3countries')
          .select('country_id, country_iso2, country_iso3');
          
        if (error) {
          console.error("Error loading country mappings:", error);
          return;
        }
        
        if (data) {
          const idToIso: Record<string, string> = {};
          const isoToId: Record<string, string> = {};
          
          data.forEach(country => {
            // Prefer ISO3 over ISO2 for mapping
            const isoCode = country.country_iso3 || country.country_iso2;
            if (country.country_id && isoCode) {
              idToIso[country.country_id] = isoCode;
              isoToId[isoCode] = country.country_id;
              
              // Also add the ISO2 mapping
              if (country.country_iso2) {
                isoToId[country.country_iso2] = country.country_id;
              }
            }
          });
          
          setCountryIdToIsoMap(idToIso);
          setIsoToCountryIdMap(isoToId);
          console.log(`Loaded mappings for ${data.length} countries`);
        }
      } catch (error) {
        console.error("Failed to load country mappings:", error);
      }
    };
    
    loadCountryMappings();
  }, []);

  // Initialize map instance
  const {
    map,
    mapError: instanceError,
    initialized: mapInitialized
  } = useMapInstance({
    mapboxToken: mapboxToken || "",
    mapContainer
  });

  // Set up direct GeoJSON approach for country layers
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
        // Use our pre-loaded mappings first for better performance
        let countryId = isoToCountryIdMap[isoCode];
        
        if (!countryId) {
          // Fallback to database query if not in the map
          countryId = await convertIsoToCountryId(isoCode);
        }
        
        if (countryId) {
          console.log(`Setting selected country to: ${countryId} (from ISO: ${isoCode})`);
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
