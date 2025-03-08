
import { STORAGE_KEYS } from "../../utils/localStorageUtils";
import { useLocalStorageState } from "./useLocalStorageState";

export const useLocationForm = () => {
  // Changed from string to string[] to support multi-select
  const [selectedCountries, setSelectedCountries] = useLocalStorageState<string[]>(
    `${STORAGE_KEYS.LOCATION}_countries`, 
    []
  );
  
  // Changed from string to string[] to support multi-select
  const [selectedLanguages, setSelectedLanguages] = useLocalStorageState<string[]>(
    `${STORAGE_KEYS.LANGUAGE}_selected`, 
    []
  );
  
  // Added state for excluded countries with multi-select support
  const [excludedCountries, setExcludedCountries] = useLocalStorageState<string[]>(
    `${STORAGE_KEYS.LOCATION}_excluded_countries`,
    []
  );
  
  // Backward compatibility: provide single-select getters/setters
  // This helps during transition to avoid breaking existing code
  const selectedCountry = selectedCountries.length > 0 ? selectedCountries[0] : "";
  const setSelectedCountry = (country: string) => {
    setSelectedCountries(country ? [country] : []);
  };
  
  const selectedLanguage = selectedLanguages.length > 0 ? selectedLanguages[0] : "";
  const setSelectedLanguage = (language: string) => {
    setSelectedLanguages(language ? [language] : []);
  };
  
  const excludedCountry = excludedCountries.length > 0 ? excludedCountries[0] : "";
  const setExcludedCountry = (country: string) => {
    setExcludedCountries(country ? [country] : []);
  };
  
  return {
    // Multi-select API
    selectedCountries,
    setSelectedCountries,
    selectedLanguages,
    setSelectedLanguages,
    excludedCountries,
    setExcludedCountries,
    
    // Single-select API (for backward compatibility)
    selectedCountry,
    setSelectedCountry,
    selectedLanguage,
    setSelectedLanguage,
    excludedCountry,
    setExcludedCountry
  };
};
