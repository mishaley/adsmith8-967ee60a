
import { useState, useEffect } from "react";
import { saveToLocalStorage, loadFromLocalStorage } from "../../utils/localStorageUtils";

/**
 * A custom hook for managing state that's synced with localStorage
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  // Initialize state with value from localStorage or the provided initialValue
  const [state, setState] = useState<T>(() => 
    loadFromLocalStorage(key, initialValue)
  );

  // Sync state changes to localStorage
  useEffect(() => {
    saveToLocalStorage(key, state);
  }, [key, state]);

  return [state, setState] as const;
}
