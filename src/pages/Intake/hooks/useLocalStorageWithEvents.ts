import { useState, useEffect } from "react";
import { cleanupLocalStorage, validateLocalStorageTypes, isValidJSON } from "../utils/localStorageUtils";
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
    validateLocalStorageTypes();
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

  // Listen for localStorage changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          // If null, the key was removed
          if (event.newValue === null) {
            logDebug(`Storage event: ${key} removed, resetting to default`);
            setValue(initialValue);
            return;
          }
          
          // Make sure it's valid JSON
          if (!isValidJSON(event.newValue)) {
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

  // Handle custom events if eventName is provided
  useEffect(() => {
    if (eventName) {
      const handleCustomEvent = (event: CustomEvent) => {
        if (!event.detail || event.detail[eventDetailKey] === undefined) {
          logWarning(`Received ${eventName} event with missing or undefined detail[${eventDetailKey}]`);
          return;
        }
        
        const newValue = event.detail[eventDetailKey];
        
        // Skip if value is the same (prevents loops)
        if (JSON.stringify(newValue) === JSON.stringify(value)) {
          logDebug(`Skipping ${eventName} event as value is unchanged`);
          return;
        }
        
        logDebug(`Received ${eventName} event with value:`, newValue);
        
        // Type validation for arrays
        if (Array.isArray(initialValue) && newValue !== null && !Array.isArray(newValue)) {
          logWarning(`Expected array from custom event for key ${key}, got:`, newValue);
          return;
        }
        
        setValue(newValue);
        
        // Also update localStorage to ensure consistency
        try {
          if (newValue !== undefined) {
            localStorage.setItem(key, JSON.stringify(newValue));
          } else {
            localStorage.removeItem(key);
          }
        } catch (error) {
          logError(`Error updating localStorage after custom event (${key}):`, error);
        }
      };

      window.addEventListener(eventName as any, handleCustomEvent as EventListener);
      return () => window.removeEventListener(eventName as any, handleCustomEvent as EventListener);
    }
  }, [eventName, eventDetailKey, key, value, initialValue]);

  // Function to update value and trigger events
  const updateValue = (newValue: T) => {
    // Skip if value is unchanged (prevents loops)
    if (JSON.stringify(newValue) === JSON.stringify(value)) {
      return;
    }
    
    logDebug(`Updating ${key} to:`, newValue);
    setValue(newValue);
    
    if (eventName) {
      // Dispatch custom event
      const detail = { [eventDetailKey]: newValue };
      logDebug(`Dispatching ${eventName} event with:`, detail);
      const event = new CustomEvent(eventName, { detail });
      window.dispatchEvent(event);
    }
  };

  return [value, updateValue] as const;
}
