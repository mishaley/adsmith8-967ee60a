
import { useState, useEffect } from "react";
import { cleanupLocalStorage } from "../utils/localStorage";
import { validationFunctions } from "../utils/localStorage";
import { logDebug, logError, logWarning } from "@/utils/logging";

interface UseLocalStorageWithEventsProps<T> {
  key: string;
  initialValue: T;
  eventName?: string;
  eventDetailKey?: string;
}

export function useLocalStorageWithEvents<T>({
  key,
  initialValue,
  eventName,
  eventDetailKey = "value"
}: UseLocalStorageWithEventsProps<T>) {
  // Run cleanup on first mount
  useEffect(() => {
    // Only run once on initial mount
    cleanupLocalStorage();
    validationFunctions.validateLocalStorageTypes();
  }, []);

  // Initialize state with the value from localStorage or the provided initialValue
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) return initialValue;
      
      // Parse and validate the stored value
      const parsedValue = JSON.parse(storedValue);
      
      // Special handling for arrays to ensure type safety
      if (Array.isArray(initialValue) && !Array.isArray(parsedValue)) {
        logWarning(`Expected array for key ${key} but got ${typeof parsedValue}. Using default.`);
        localStorage.removeItem(key);
        return initialValue;
      }
      
      return parsedValue;
    } catch (error) {
      logError(`Error parsing localStorage value for key ${key}:`, error);
      // Clear the invalid data
      localStorage.removeItem(key);
      return initialValue;
    }
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      if (value !== undefined) {
        // Special handling for arrays to prevent storing non-arrays
        if (Array.isArray(initialValue) && !Array.isArray(value)) {
          logError(`Attempted to save non-array to ${key} which expects an array. Ignoring.`);
          return;
        }
        
        localStorage.setItem(key, JSON.stringify(value));
        logDebug(`Saved to localStorage: ${key} =`, value);
      } else {
        localStorage.removeItem(key);
        logDebug(`Removed from localStorage: ${key}`);
      }
    } catch (error) {
      logError(`Error saving to localStorage (${key}):`, error);
    }
  }, [key, value, initialValue]);

  // Listen for localStorage changes in other tabs/windows and form clearing
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          // If null, the key was removed (e.g., during form clearing)
          if (event.newValue === null) {
            logDebug(`Storage event: ${key} removed (form clearing), resetting to default`);
            setValue(initialValue);
            return;
          }
          
          // Make sure it's valid JSON
          if (!validationFunctions.isValidJSON(event.newValue)) {
            logError(`Invalid JSON received in storage event for key ${key}`);
            setValue(initialValue);
            return;
          }
          
          const parsedValue = JSON.parse(event.newValue);
          
          // Type validation for arrays
          if (Array.isArray(initialValue) && !Array.isArray(parsedValue)) {
            logWarning(`Expected array from storage event for key ${key}`);
            setValue(initialValue);
            return;
          }
          
          logDebug(`Storage event: ${key} updated to:`, parsedValue);
          setValue(parsedValue);
        } catch (error) {
          logError(`Error parsing storage event value for key ${key}:`, error);
          setValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initialValue, key]);

  // Also listen for special "clearForm" event
  useEffect(() => {
    const handleClearForm = () => {
      logDebug(`Clear form event detected, resetting ${key} to default`);
      setValue(initialValue);
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => window.removeEventListener('clearForm', handleClearForm);
  }, [key, initialValue]);

  // Function to update value
  const updateValue = (newValue: T) => {
    // Skip if value is unchanged (prevents loops)
    if (JSON.stringify(newValue) === JSON.stringify(value)) {
      return;
    }
    
    logDebug(`Updating ${key} to:`, newValue);
    setValue(newValue);
    
    // We're no longer dispatching custom events for cross-component syncing
  };

  return [value, updateValue] as const;
}
