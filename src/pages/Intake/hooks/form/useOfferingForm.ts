
import { STORAGE_KEYS } from "../../utils/localStorage";
import { useLocalStorageState } from "./useLocalStorageState";

export const useOfferingForm = () => {
  const [offering, setOffering] = useLocalStorageState<string>(
    `${STORAGE_KEYS.OFFERING}_name`, 
    ""
  );
  
  const [sellingPoints, setSellingPoints] = useLocalStorageState<string>(
    `${STORAGE_KEYS.OFFERING}_sellingPoints`, 
    ""
  );
  
  const [problemSolved, setProblemSolved] = useLocalStorageState<string>(
    `${STORAGE_KEYS.OFFERING}_problem`, 
    ""
  );
  
  const [uniqueOffering, setUniqueOffering] = useLocalStorageState<string>(
    `${STORAGE_KEYS.OFFERING}_unique`, 
    ""
  );
  
  return {
    offering,
    setOffering,
    sellingPoints,
    setSellingPoints,
    problemSolved,
    setProblemSolved,
    uniqueOffering,
    setUniqueOffering
  };
};
