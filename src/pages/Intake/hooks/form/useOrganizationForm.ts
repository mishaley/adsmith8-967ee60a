
import { STORAGE_KEYS } from "../../utils/localStorageUtils";
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
  
  const [businessDescription, setBusinessDescription] = useLocalStorageState<string>(
    `${STORAGE_KEYS.ORGANIZATION}_description`, 
    ""
  );

  // Debug the current values
  console.log("useOrganizationForm - Current values:", {
    brandName,
    industry,
    businessDescription
  });

  return {
    brandName,
    setBrandName,
    industry,
    setIndustry,
    businessDescription,
    setBusinessDescription
  };
};
