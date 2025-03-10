
import { isValidJSON } from './validation';

/**
 * Safe clear method that validates keys first
 */
export const safelyRemoveInvalidLocalStorage = (keyPrefix: string): void => {
  try {
    // Find and validate all keys that start with the specified prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(keyPrefix)) {
        const value = localStorage.getItem(key);
        if (value !== null && !isValidJSON(value)) {
          console.warn(`Removing invalid JSON data for key: ${key}`);
          localStorage.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error(`Error cleaning invalid localStorage data for prefix ${keyPrefix}:`, error);
  }
};

/**
 * Clean up localStorage - remove any invalid JSON
 */
export const cleanupLocalStorage = (): void => {
  try {
    const keysToRemove: string[] = [];
    
    // First collect all keys with invalid data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          try {
            JSON.parse(value);
          } catch (e) {
            // Add to keys to remove if JSON parsing fails
            keysToRemove.push(key);
            console.warn(`Found invalid JSON in localStorage key: ${key}`);
          }
        }
      }
    }
    
    // Then remove them all
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.info(`Removed invalid localStorage key: ${key}`);
      } catch (e) {
        console.error(`Failed to remove invalid localStorage key: ${key}`, e);
      }
    });
    
    if (keysToRemove.length > 0) {
      console.info(`Cleaned up ${keysToRemove.length} invalid localStorage items`);
    }
  } catch (error) {
    console.error('Error during localStorage cleanup:', error);
  }
};
