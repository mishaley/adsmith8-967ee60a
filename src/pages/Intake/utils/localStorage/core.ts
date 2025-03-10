
import { logDebug, logWarning, logError, logInfo } from "@/utils/logging";

/**
 * Generic save function with validation and error handling
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    if (data === undefined) {
      logWarning(`Attempted to save undefined data to localStorage (${key}). Removing key instead.`, 'localStorage');
      localStorage.removeItem(key);
      return;
    }
    
    // Skip redundant logging of empty arrays or empty objects
    // (these are common and cause too much console noise)
    const isEmptyArrayOrObj = 
      (Array.isArray(data) && data.length === 0) || 
      (data !== null && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0);
    
    if (!isEmptyArrayOrObj) {
      logDebug(`Saving to localStorage: ${key}`, 'localStorage');
    }
    
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    logError(`Error saving to localStorage (${key}):`, 'localStorage', error);
    // If storing fails, attempt to clear this key to prevent inconsistent state
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // If even removing fails, log but continue
      logError(`Failed to clean up invalid localStorage key (${key}):`, 'localStorage', e);
    }
  }
};

/**
 * Generic load function with type safety and validation
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    // Try to parse the JSON and validate it
    const parsed = JSON.parse(item);
    
    // Special handling for arrays - ensure they're actually arrays
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
      logWarning(`Expected array for key ${key} but got ${typeof parsed}. Using default.`, 'localStorage');
      localStorage.removeItem(key); // Remove invalid data
      return defaultValue;
    }
    
    // Special handling for objects - ensure they're actually objects
    if (defaultValue !== null && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        logWarning(`Expected object for key ${key} but got ${typeof parsed}. Using default.`, 'localStorage');
        localStorage.removeItem(key); // Remove invalid data
        return defaultValue;
      }
    }
    
    return parsed;
  } catch (error) {
    logError(`Error loading from localStorage (${key}):`, 'localStorage', error);
    // Remove invalid data to prevent future errors
    try {
      localStorage.removeItem(key);
    } catch (e) {
      logError(`Failed to remove invalid localStorage data for key (${key}):`, 'localStorage', e);
    }
    return defaultValue;
  }
};

/**
 * Clear specific cache item
 */
export const clearLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
    logDebug(`Removed localStorage item: ${key}`, 'localStorage');
  } catch (error) {
    logError(`Error clearing localStorage item (${key}):`, 'localStorage', error);
  }
};

/**
 * Batch clear multiple keys with a prefix
 */
export const clearLocalStorageByPrefix = (prefix: string): void => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove the keys in a separate loop to avoid issues with
    // changing localStorage during iteration
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    logInfo(`Cleared ${keysToRemove.length} localStorage items with prefix "${prefix}"`, 'localStorage');
  } catch (error) {
    logError(`Error clearing localStorage items with prefix "${prefix}":`, 'localStorage', error);
  }
};

/**
 * Checks if a key exists in localStorage
 */
export const localStorageHasKey = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    logError(`Error checking localStorage key (${key}):`, 'localStorage', error);
    return false;
  }
};
