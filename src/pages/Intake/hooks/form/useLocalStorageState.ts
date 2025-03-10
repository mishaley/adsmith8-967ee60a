
import { useState, useEffect } from "react";
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  cleanupLocalStorage, 
  validateLocalStorageTypes 
} from "../../utils/localStorage";
import { logError, logWarning, logDebug } from "@/utils/logging";

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
        logWarning(`Expected array for key ${key} but got ${typeof storedValue}. Using default.`);
        return initialValue;
      }
      
      // Additional checks for null/undefined when we expect an object
      if (
        initialValue !== null && 
        typeof initialValue === 'object' && 
        !Array.isArray(initialValue) && 
        (storedValue === null || typeof storedValue !== 'object' || Array.isArray(storedValue))
      ) {
        logWarning(`Expected object for key ${key} but got ${typeof storedValue}. Using default.`);
        return initialValue;
      }
      
      return storedValue;
    } catch (error) {
      logError(`Error initializing from localStorage (${key}):`, error);
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
        logError(`Attempted to save non-array to ${key} which expects an array. Ignoring.`);
        return;
      }
      
      // Log the value being saved for debugging
      logDebug(`Saving to localStorage: ${key}`, state);
      
      saveToLocalStorage(key, state);
    } catch (error) {
      logError(`Error saving to localStorage (${key}):`, error);
    }
  }, [key, state, initialValue]);

  // Listen for storage events (including when clear form is triggered)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // If this key was removed from localStorage (e.g. during form clearing)
      if (event.key === key && event.newValue === null) {
        // Reset our state to the initial value
        setState(initialValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  // Listen for clearForm events
  useEffect(() => {
    const handleClearForm = () => {
      logDebug(`Clear form event detected in useLocalStorageState for ${key}`);
      setState(initialValue);
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => window.removeEventListener('clearForm', handleClearForm);
  }, [initialValue, key]);

  return [state, setState] as const;
}
