
// Constants for storage keys to avoid typos
export const STORAGE_KEYS = {
  ORGANIZATION: 'adsmith_organization',
  OFFERING: 'adsmith_offering',
  LOCATION: 'adsmith_location',
  PERSONAS: 'adsmith_personas',
  LANGUAGE: 'adsmith_language',
  MESSAGES: 'adsmith_messages',
  PLATFORMS: 'adsmith_platforms',
  IMAGES: 'adsmith_images',
  CAPTIONS: 'adsmith_captions',
  PARAMETERS: 'adsmith_parameters',
  LAST_ROUTE: 'adsmith_last_route',
  SECTION_STATES: 'adsmith_section_states'
};

// Generic save function
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
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

// Generic load function with type safety
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
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

// Clear specific cache item
export const clearLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing localStorage item (${key}):`, error);
  }
};

// Clear all cache
export const clearAllLocalStorage = (): void => {
  try {
    // Clear all keys and their sub-keys
    Object.values(STORAGE_KEYS).forEach(baseKey => {
      // Skip clearing section states when clearing form data
      if (baseKey === STORAGE_KEYS.SECTION_STATES) {
        return;
      }
      
      // Clear the base key itself
      localStorage.removeItem(baseKey);
      
      // Find and clear all keys that start with the base key followed by underscore
      // This catches keys like ORGANIZATION_brandName, ORGANIZATION_industry, etc.
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${baseKey}_`)) {
          localStorage.removeItem(key);
        }
      }
    });
    
    console.log("All localStorage items cleared successfully");
  } catch (error) {
    console.error('Error clearing all localStorage items:', error);
  }
};

// Clear form and refresh the page
export const clearFormAndRefresh = (): void => {
  clearAllLocalStorage();
  // Refresh the page to reset all state
  window.location.reload();
};

// Validate if a string is valid JSON
export const isValidJSON = (str: string | null): boolean => {
  if (!str) return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// Safe clear method that validates keys first
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
