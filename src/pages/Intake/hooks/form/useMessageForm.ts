
import { STORAGE_KEYS } from "../../utils/localStorageUtils";
import { useLocalStorageState } from "./useLocalStorageState";
import { Message } from "../../components/Messages/hooks/useMessagesFetching";

export const useMessageForm = () => {
  const [generatedMessages, setGeneratedMessages] = useLocalStorageState<
    Record<string, Record<string, Message>>
  >(
    `${STORAGE_KEYS.MESSAGES}_generated`, 
    {}
  );
  
  const [selectedMessageTypes, setSelectedMessageTypes] = useLocalStorageState<string[]>(
    `${STORAGE_KEYS.MESSAGES}_types`, 
    ["tagline"]
  );
  
  return {
    generatedMessages,
    setGeneratedMessages,
    selectedMessageTypes,
    setSelectedMessageTypes
  };
};
