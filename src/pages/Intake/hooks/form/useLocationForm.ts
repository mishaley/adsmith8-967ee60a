
import { STORAGE_KEYS } from "../../utils/localStorageUtils";
import { useLocalStorageState } from "./useLocalStorageState";

export const useLocationForm = () => {
  const [selectedCountry, setSelectedCountry] = useLocalStorageState<string>(
    `${STORAGE_KEYS.LOCATION}_country`, 
    "US"
  );
  
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
