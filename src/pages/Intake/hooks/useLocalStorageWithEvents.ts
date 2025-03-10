import { useState, useEffect, useRef } from 'react';
import { validationFunctions } from '../utils/localStorage';
import { logDebug, logError, logInfo } from '@/utils/logging';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

function useLocalStorageWithEvents<T>(
  key: string,
  initialValue: T,
  options?: {
    validateData?: (data: any) => boolean;
    formatter?: (data: any) => T;
  }
): [T, SetValue<T>, boolean] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or if none return initialValue
      if (!item) {
        return initialValue;
      }
      
      let parsedItem;
      try {
        parsedItem = JSON.parse(item);
        
        // Apply custom validation if provided
        if (options?.validateData && !options.validateData(parsedItem)) {
          logError(`Invalid data format for ${key}, using default value`, 'localStorage');
          return initialValue;
        }
        
        // Apply custom formatter if provided
        if (options?.formatter) {
          return options.formatter(parsedItem);
        }
        
        return parsedItem;
      } catch {
        // If we can't parse as JSON, check if it's valid before returning
        if (validationFunctions.isValidJSON(item)) {
          return JSON.parse(item);
        }
        return initialValue;
      }
    } catch (error) {
      // If error, use initial value
      logError(`Error reading localStorage key "${key}"`, 'localStorage', error);
      return initialValue;
    }
  });

  // Track loading state, especially for async operations
  const [isLoading, setIsLoading] = useState(false);
  
  // Track if this is the first render
  const isFirstRender = useRef(true);
  
  // Track prev value to avoid unnecessary updates
  const prevValue = useRef<T>(initialValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue: SetValue<T> = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Only save if the value has changed
      if (JSON.stringify(valueToStore) !== JSON.stringify(prevValue.current)) {
        logDebug(`Saving new value to localStorage: ${key}`, 'localStorage');
      
        // Save state
        setStoredValue(valueToStore);
  
        // Save to local storage
        if (typeof window !== 'undefined') {
          if (valueToStore === undefined) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
        }
        
        // Update prev value
        prevValue.current = valueToStore;
      }
    } catch (error) {
      logError(`Error saving to localStorage key "${key}"`, 'localStorage', error);
    }
  };

  // Listen for storage events to keep all tabs in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          
          // Apply custom validation if provided
          if (options?.validateData && !options.validateData(newValue)) {
            return;
          }
          
          // Apply formatter if needed
          const formattedValue = options?.formatter ? options.formatter(newValue) : newValue;
          setStoredValue(formattedValue);
          prevValue.current = formattedValue;
          
          logDebug(`Updated state from storage event for key: ${key}`, 'localStorage');
        } catch (err) {
          logError(`Error processing storage event for key "${key}"`, 'localStorage', err);
        }
      } else if (e.key === key && e.newValue === null) {
        // Key was removed
        setStoredValue(initialValue);
        prevValue.current = initialValue;
        logDebug(`Key "${key}" was removed, reset to initial value`, 'localStorage');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue, options]);

  // We should save to localStorage on the first render if we have an initialValue
  // AND the key doesn't already exist in localStorage
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
      // Check if the key exists in localStorage
      if (typeof window !== 'undefined' && window.localStorage.getItem(key) === null && initialValue !== undefined) {
        // Save the initial value to localStorage
        setValue(initialValue);
        logDebug(`Initialized localStorage key "${key}" with default value`, 'localStorage');
      }
    }
  }, [key, initialValue, setValue]);

  // Listen for clearForm events
  useEffect(() => {
    const handleClearForm = () => {
      logDebug(`Clear form event detected for localStorage key: ${key}`, 'localStorage');
      setStoredValue(initialValue);
      prevValue.current = initialValue;
      
      // Also remove from localStorage if event triggered
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    };
    
    window.addEventListener('clearForm', handleClearForm);
    
    return () => {
      window.removeEventListener('clearForm', handleClearForm);
    };
  }, [initialValue, key]);

  return [storedValue, setValue, isLoading];
}

export default useLocalStorageWithEvents;
