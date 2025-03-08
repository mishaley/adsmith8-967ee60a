
import { useState, useEffect } from "react";
import { useCountries } from "./useCountries";

interface UseExcludedCountryProps {
  setExcludedCountryId?: ((id: string) => void) | null;
}

export const useExcludedCountry = ({ setExcludedCountryId }: UseExcludedCountryProps) => {
  const [excludedCountry, setExcludedCountry] = useState<string>('');
  const { countries } = useCountries();
  const [excludedCountryFlag, setExcludedCountryFlag] = useState<string | null>(null);
  
  useEffect(() => {
    if (excludedCountry && countries.length > 0) {
      const country = countries.find(c => c.country_id === excludedCountry);
      if (country) {
        setExcludedCountryFlag(country.country_flag);
        
        // Highlight the excluded country on the map if possible
        if (setExcludedCountryId) {
          // We might need to convert UUID to ISO code first
          const iso = country.country_iso2 || country.country_iso3;
          if (iso) {
            console.log(`Highlighting excluded country on map: ${iso}`);
            setExcludedCountryId(iso);
          } else {
            setExcludedCountryId(excludedCountry);
          }
        }
      }
    } else {
      setExcludedCountryFlag(null);
      
      // Clear excluded country on the map
      if (setExcludedCountryId) {
        setExcludedCountryId("");
      }
    }
  }, [excludedCountry, countries, setExcludedCountryId]);

  const handleClearExclusion = () => {
    setExcludedCountry("");
    setExcludedCountryFlag(null);
    
    // Clear excluded country on the map
    if (setExcludedCountryId) {
      setExcludedCountryId("");
    }
  };

  return {
    excludedCountry,
    setExcludedCountry,
    excludedCountryFlag,
    handleClearExclusion
  };
};
