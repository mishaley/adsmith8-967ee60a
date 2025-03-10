
import { STORAGE_KEYS } from "../../utils/localStorage";
import { useLocalStorageState } from "./useLocalStorageState";

export const usePlatformForm = () => {
  const [adPlatform, setAdPlatform] = useLocalStorageState<string>(
    `${STORAGE_KEYS.PLATFORMS}_selected`, 
    "meta"
  );
  
  return {
    adPlatform,
    setAdPlatform
  };
};
