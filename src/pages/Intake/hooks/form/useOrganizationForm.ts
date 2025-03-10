
import { STORAGE_KEYS } from "../../utils/localStorage";
import { useLocalStorageState } from "./useLocalStorageState";

export const useOrganizationForm = () => {
  const [brandName, setBrandName] = useLocalStorageState<string>(
    `${STORAGE_KEYS.ORGANIZATION}_brandName`, 
    ""
  );
  
  const [industry, setIndustry] = useLocalStorageState<string>(
    `${STORAGE_KEYS.ORGANIZATION}_industry`, 
    ""
  );

  return {
    brandName,
    setBrandName,
    industry,
    setIndustry
  };
};
