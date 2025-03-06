
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to load and manage country ID to ISO code mappings
 */
export const useCountryMappings = () => {
  const [countryIdToIsoMap, setCountryIdToIsoMap] = useState<Record<string, string>>({});
  const [isoToCountryIdMap, setIsoToCountryIdMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load country mappings once
  useEffect(() => {
    const loadCountryMappings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('y3countries')
          .select('country_id, country_iso2, country_iso3');
          
        if (error) {
          console.error("Error loading country mappings:", error);
          setError(`Failed to load country mappings: ${error.message}`);
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
        setError(`Failed to load country mappings: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCountryMappings();
  }, []);

  return {
    countryIdToIsoMap,
    isoToCountryIdMap,
    isLoading,
    error
  };
};
