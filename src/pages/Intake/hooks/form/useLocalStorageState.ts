
import { useState, useEffect, useRef } from "react";
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  clearLocalStorageItem, 
  localStorageHasKey,
  clearLocalStorageByPrefix
} from "../../utils/localStorage";
import { logDebug, logWarning, logError, logInfo } from "@/utils/logging";

/**
 * A custom hook for managing state that's synced with localStorage
 * with improved error handling and data validation
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  // Reference to track if this is the first mount
  const isFirstMount = useRef(true);

  // Initialize state with value from localStorage or the provided initialValue
  const [state, setState] = useState<T>(() => {
    try {
      // Don't log during initialization to reduce console noise
      const storedValue = loadFromLocalStorage(key, initialValue);
      
      // Type validation for arrays
      if (Array.isArray(initialValue) && !Array.isArray(storedValue)) {
        logWarning(`Expected array for key ${key} but got ${typeof storedValue}. Using default.`);
        return initialValue;
      }
      
      // Type validation for objects
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

  // Log on first mount
  useEffect(() => {
    if (isFirstMount.current) {
      const exists = localStorageHasKey(key);
      logDebug(`useLocalStorageState initialized for ${key}: ${exists ? 'loaded from storage' : 'using default value'}`);
      isFirstMount.current = false;
    }
  }, [key]);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      // Skip first render to avoid duplicate storage
      if (isFirstMount.current) return;
      
      // Special handling for undefined (don't store it)
      if (state === undefined) {
        clearLocalStorageItem(key);
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
        logInfo(`Storage event detected: ${key} was removed, resetting state`);
      } 
      // If this key was updated from another tab
      else if (event.key === key && event.newValue !== null) {
        try {
          const newValue = JSON.parse(event.newValue);
          setState(newValue);
          logInfo(`Storage event detected: ${key} was updated, syncing state`);
        } catch (e) {
          logError(`Error parsing storage event value for ${key}`, e);
        }
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

  // Enhanced setState that also updates localStorage
  const setStateAndStorage = (value: T | ((prev: T) => T)) => {
    setState(value);
  };

  return [state, setStateAndStorage] as const;
}
