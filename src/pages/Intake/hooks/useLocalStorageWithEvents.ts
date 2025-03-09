
import { useState, useEffect } from "react";

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
  // Initialize state with the value from localStorage or the provided initialValue
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) return initialValue;
      return JSON.parse(storedValue);
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
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }, [key, value]);

  // Listen for localStorage changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue;
          setValue(newValue);
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
        const newValue = event.detail[eventDetailKey];
        if (newValue !== undefined && newValue !== value) {
          console.log(`Received ${eventName} event with value:`, newValue);
          setValue(newValue);
          
          // Also update localStorage to ensure consistency
          try {
            if (newValue) {
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
  }, [eventName, eventDetailKey, key, value]);

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
