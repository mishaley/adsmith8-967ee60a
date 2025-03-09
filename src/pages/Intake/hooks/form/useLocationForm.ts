
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
  
  return {
    // Only expose multi-select API
    selectedCountries,
    setSelectedCountries,
    selectedLanguages,
    setSelectedLanguages,
    excludedCountries,
    setExcludedCountries,
  };
};
