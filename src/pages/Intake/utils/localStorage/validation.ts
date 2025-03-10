
// Utility functions for validating localStorage data

/**
 * Validate if a string is valid JSON
 */
export const isValidJSON = (str: string | null): boolean => {
  if (!str) return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if the value is a valid array
 */
export const isValidArray = (value: any): boolean => {
  return Array.isArray(value);
};

/**
 * Validate types of localStorage entries
 */
export const validateLocalStorageTypes = (): void => {
  try {
    // Import here to avoid circular dependency
    import('./constants').then(({ STORAGE_KEYS }) => {
      // Check array types for keys that should contain arrays
      const arrayKeys = [
        `${STORAGE_KEYS.LOCATION}_countries`,
        `${STORAGE_KEYS.LOCATION}_languages`,
        `${STORAGE_KEYS.LOCATION}_excluded`,
        `${STORAGE_KEYS.MESSAGES}_types`
      ];
      
      arrayKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) {
              console.warn(`Key ${key} should be an array but found ${typeof parsed}. Resetting.`);
              localStorage.removeItem(key);
            }
          } catch (e) {
            console.warn(`Invalid JSON in key ${key}. Removing.`);
            localStorage.removeItem(key);
          }
        }
      });
    });
  } catch (error) {
    console.error('Error validating localStorage types:', error);
  }
};
