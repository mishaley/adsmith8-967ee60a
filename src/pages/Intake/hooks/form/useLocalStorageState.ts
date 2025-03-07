
import { useState, useEffect } from "react";
import { saveToLocalStorage, loadFromLocalStorage } from "../../utils/localStorageUtils";

/**
 * A custom hook for managing state that's synced with localStorage
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  // Initialize state with value from localStorage or the provided initialValue
  const [state, setState] = useState<T>(() => {
    const storedValue = loadFromLocalStorage(key, initialValue);
    console.log(`Initial load from localStorage [${key}]:`, storedValue);
    return storedValue;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    console.log(`Saving to localStorage [${key}]:`, state);
    saveToLocalStorage(key, state);
  }, [key, state]);

  return [state, setState] as const;
}
