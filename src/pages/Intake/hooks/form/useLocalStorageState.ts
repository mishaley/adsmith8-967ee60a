
import { useState, useEffect } from "react";
import { saveToLocalStorage, loadFromLocalStorage } from "../../utils/localStorageUtils";

/**
 * A custom hook for managing state that's synced with localStorage
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  // Initialize state with value from localStorage or the provided initialValue
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = loadFromLocalStorage(key, initialValue);
      return storedValue;
    } catch (error) {
      console.error(`Error initializing from localStorage (${key}):`, error);
      // If there's an error parsing the stored value, use the initial value
      // and clear the invalid localStorage entry
      localStorage.removeItem(key);
      return initialValue;
    }
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      saveToLocalStorage(key, state);
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }, [key, state]);

  return [state, setState] as const;
}
