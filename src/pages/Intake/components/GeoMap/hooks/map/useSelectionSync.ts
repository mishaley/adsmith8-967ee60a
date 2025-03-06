
import { useCallback } from "react";
import { convertIsoToCountryId } from "./layers/utils/countryIdUtils";

interface UseSelectionSyncProps {
  isoToCountryIdMap: Record<string, string>;
  setSelectedCountry: (country: string) => void;
}

/**
 * Hook to handle synchronization between map country selection and component state
 */
export const useSelectionSync = ({
  isoToCountryIdMap,
  setSelectedCountry
}: UseSelectionSyncProps) => {
  
  // Handler for when a country is selected on the map
  const handleCountrySelected = useCallback(async (isoCode: string) => {
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
  }, [isoToCountryIdMap, setSelectedCountry]);
  
  return {
    handleCountrySelected
  };
};
