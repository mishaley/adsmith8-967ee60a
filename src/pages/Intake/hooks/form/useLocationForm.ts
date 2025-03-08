import { STORAGE_KEYS } from "../../utils/localStorageUtils";
import { useLocalStorageState } from "./useLocalStorageState";

export const useLocationForm = () => {
  // For country, we'll continue to use a single string since the current UI design assumes
  // a single country selection
  const [selectedCountry, setSelectedCountry] = useLocalStorageState<string>(
    `${STORAGE_KEYS.LOCATION}_country`, 
    "US"
  );
  
  // For language, we keep it as a string for now to maintain compatibility
  const [selectedLanguage, setSelectedLanguage] = useLocalStorageState<string>(
    `${STORAGE_KEYS.LANGUAGE}_selected`, 
    "en"
  );
  
  return {
    selectedCountry,
    setSelectedCountry,
    selectedLanguage,
    setSelectedLanguage
  };
};
