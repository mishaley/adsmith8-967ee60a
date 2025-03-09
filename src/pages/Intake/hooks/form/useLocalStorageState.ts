
import { useState, useEffect } from "react";
import { saveToLocalStorage, loadFromLocalStorage, cleanupLocalStorage, validateLocalStorageTypes } from "../../utils/localStorageUtils";

/**
 * A custom hook for managing state that's synced with localStorage
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  // Run cleanup on first mount
  useEffect(() => {
    // Only run once on initial mount
    cleanupLocalStorage();
    validateLocalStorageTypes();
  }, []);

  // Initialize state with value from localStorage or the provided initialValue
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = loadFromLocalStorage(key, initialValue);
      
      // Additional type validation for arrays
      if (Array.isArray(initialValue) && !Array.isArray(storedValue)) {
        console.warn(`Expected array for key ${key} but got ${typeof storedValue}. Using default.`);
        return initialValue;
      }
      
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
      // Special handling for undefined (don't store it)
      if (state === undefined) {
        localStorage.removeItem(key);
        return;
      }
      
      // Special validation for arrays to prevent corrupted state
      if (Array.isArray(initialValue) && !Array.isArray(state)) {
        console.error(`Attempted to save non-array to ${key} which expects an array. Ignoring.`);
        return;
      }
      
      saveToLocalStorage(key, state);
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }, [key, state, initialValue]);

  return [state, setState] as const;
}
