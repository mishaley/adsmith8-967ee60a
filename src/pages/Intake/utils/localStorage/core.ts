
/**
 * Generic save function with validation and error handling
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    if (data === undefined) {
      console.warn(`Attempted to save undefined data to localStorage (${key}). Removing key instead.`);
      localStorage.removeItem(key);
      return;
    }
    
    // Special handling for empty arrays or objects
    if (Array.isArray(data) && data.length === 0) {
      console.log(`Saving empty array to localStorage (${key})`);
      // We still save empty arrays as they're valid states
    }
    
    // For objects, check if they're empty but still valid
    if (data !== null && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0) {
      console.log(`Saving empty object to localStorage (${key})`);
      // We still save empty objects as they're valid states
    }
    
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
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
      console.warn(`Expected array for key ${key} but got ${typeof parsed}. Using default.`);
      localStorage.removeItem(key); // Remove invalid data
      return defaultValue;
    }
    
    // Special handling for objects - ensure they're actually objects
    if (defaultValue !== null && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        console.warn(`Expected object for key ${key} but got ${typeof parsed}. Using default.`);
        localStorage.removeItem(key); // Remove invalid data
        return defaultValue;
      }
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
    
    console.log(`Cleared ${keysToRemove.length} localStorage items with prefix "${prefix}"`);
  } catch (error) {
    console.error(`Error clearing localStorage items with prefix "${prefix}":`, error);
  }
};

/**
 * Checks if a key exists in localStorage
 */
export const localStorageHasKey = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage key (${key}):`, error);
    return false;
  }
};
