
import { isValidJSON } from './validation';

/**
 * Generic save function
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    if (data === undefined) {
      console.warn(`Attempted to save undefined data to localStorage (${key}). Removing key instead.`);
      localStorage.removeItem(key);
      return;
    }
    
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    // If storing fails, attempt to clear this key to prevent inconsistent state
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // If even removing fails, log but continue
      console.error(`Failed to clean up invalid localStorage key (${key}):`, e);
    }
  }
};

/**
 * Generic load function with type safety
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    // Try to parse the JSON and validate it
    const parsed = JSON.parse(item);
    
    // Special handling for arrays - ensure they're actually arrays
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
      console.warn(`Expected array for key ${key} but got ${typeof parsed}. Using default.`);
      localStorage.removeItem(key); // Remove invalid data
      return defaultValue;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    // Remove invalid data to prevent future errors
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove invalid localStorage data for key (${key}):`, e);
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
  } catch (error) {
    console.error(`Error clearing localStorage item (${key}):`, error);
  }
};
