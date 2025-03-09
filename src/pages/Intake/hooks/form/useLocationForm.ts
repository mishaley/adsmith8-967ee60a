
import { STORAGE_KEYS } from "../../utils/localStorageUtils";
import { useLocalStorageState } from "./useLocalStorageState";

export const useLocationForm = () => {
  // Multi-select countries state
  const [selectedCountries, setSelectedCountries] = useLocalStorageState<string[]>(
    `${STORAGE_KEYS.LOCATION}_countries`, 
    []
  );
  
  // Multi-select languages state
  const [selectedLanguages, setSelectedLanguages] = useLocalStorageState<string[]>(
    `${STORAGE_KEYS.LANGUAGE}_selected`, 
    []
  );
  
  // Multi-select excluded countries state
  const [excludedCountries, setExcludedCountries] = useLocalStorageState<string[]>(
    `${STORAGE_KEYS.LOCATION}_excluded_countries`,
    []
  );
  
  // Backward compatibility - define single-select accessors based on the multi-select arrays
  // This helps with compatibility for components that still expect single values
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
    // Multi-select API (primary implementation)
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
