
import { useState, useEffect } from "react";
import { cleanupLocalStorage, validateLocalStorageTypes, isValidJSON } from "../utils/localStorageUtils";

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
        console.warn(`Expected array for key ${key} but got ${typeof parsedValue}. Using default.`);
        localStorage.removeItem(key);
        return initialValue;
      }
      
      return parsedValue;
    } catch (error) {
      console.error(`Error parsing localStorage value for key ${key}:`, error);
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
          console.error(`Attempted to save non-array to ${key} which expects an array. Ignoring.`);
          return;
        }
        
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }, [key, value, initialValue]);

  // Listen for localStorage changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          // If null, the key was removed
          if (event.newValue === null) {
            setValue(initialValue);
            return;
          }
          
          // Make sure it's valid JSON
          if (!isValidJSON(event.newValue)) {
            console.error(`Invalid JSON received in storage event for key ${key}`);
            setValue(initialValue);
            return;
          }
          
          const parsedValue = JSON.parse(event.newValue);
          
          // Type validation for arrays
          if (Array.isArray(initialValue) && !Array.isArray(parsedValue)) {
            console.warn(`Expected array from storage event for key ${key}`);
            setValue(initialValue);
            return;
          }
          
          setValue(parsedValue);
        } catch (error) {
          console.error(`Error parsing storage event value for key ${key}:`, error);
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
          console.warn(`Received ${eventName} event with missing or undefined detail[${eventDetailKey}]`);
          return;
        }
        
        const newValue = event.detail[eventDetailKey];
        if (newValue !== value) {
          console.log(`Received ${eventName} event with value:`, newValue);
          
          // Type validation for arrays
          if (Array.isArray(initialValue) && newValue !== null && !Array.isArray(newValue)) {
            console.warn(`Expected array from custom event for key ${key}`);
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
            console.error(`Error updating localStorage after custom event (${key}):`, error);
          }
        }
      };

      window.addEventListener(eventName as any, handleCustomEvent as EventListener);
      return () => window.removeEventListener(eventName as any, handleCustomEvent as EventListener);
    }
  }, [eventName, eventDetailKey, key, value, initialValue]);

  // Function to dispatch custom event
  const dispatchValueChangeEvent = (newValue: T) => {
    if (eventName) {
      const detail = { [eventDetailKey]: newValue };
      const event = new CustomEvent(eventName, { detail });
      window.dispatchEvent(event);
    }
  };

  // Function to update value and trigger events
  const updateValue = (newValue: T) => {
    setValue(newValue);
    
    if (eventName) {
      dispatchValueChangeEvent(newValue);
    }
  };

  return [value, updateValue] as const;
}
