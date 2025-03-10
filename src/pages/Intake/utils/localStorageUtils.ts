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

// Generic load function with type safety
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

// Clear specific cache item
export const clearLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing localStorage item (${key}):`, error);
  }
};

// Clear all intake form data
export const clearAllLocalStorage = (): void => {
  try {
    // Create an array of all form-related keys we want to clear
    const keysToRemove = [
      // Organization keys
      STORAGE_KEYS.ORGANIZATION,
      `${STORAGE_KEYS.ORGANIZATION}_brandName`,
      `${STORAGE_KEYS.ORGANIZATION}_industry`,
      'selectedOrganizationId', // Add the key used by OrganizationSelector
      
      // Offering keys
      STORAGE_KEYS.OFFERING,
      `${STORAGE_KEYS.OFFERING}_name`,
      `${STORAGE_KEYS.OFFERING}_sellingPoints`,
      `${STORAGE_KEYS.OFFERING}_problem`,
      `${STORAGE_KEYS.OFFERING}_unique`,
      `${STORAGE_KEYS.OFFERING}_selectedId`,
      
      // Location keys
      STORAGE_KEYS.LOCATION,
      `${STORAGE_KEYS.LOCATION}_countries`,
      `${STORAGE_KEYS.LOCATION}_excluded_countries`,
      
      // Language keys
      STORAGE_KEYS.LANGUAGE,
      `${STORAGE_KEYS.LANGUAGE}_selected`,
      
      // Persona keys
      STORAGE_KEYS.PERSONAS,
      `${STORAGE_KEYS.PERSONAS}_data`,
      `${STORAGE_KEYS.PERSONAS}_count`,
      `${STORAGE_KEYS.PERSONAS}_summary`,
      
      // Messages keys
      STORAGE_KEYS.MESSAGES,
      `${STORAGE_KEYS.MESSAGES}_generated`,
      `${STORAGE_KEYS.MESSAGES}_types`,
      `${STORAGE_KEYS.MESSAGES}_userProvided`,
      `${STORAGE_KEYS.MESSAGES}_tableVisible`,
      
      // Platform keys
      STORAGE_KEYS.PLATFORMS,
      `${STORAGE_KEYS.PLATFORMS}_selected`,
      
      // Images keys
      STORAGE_KEYS.IMAGES,
      
      // Captions and Parameters keys
      STORAGE_KEYS.CAPTIONS,
      STORAGE_KEYS.PARAMETERS
    ];
    
    // Clear all listed keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Cleared ${key} from localStorage`);
    });
    
    // Also scan for any keys that start with our prefixes
    // (this catches any dynamically generated keys we might have missed)
    const prefixes = [...Object.values(STORAGE_KEYS), 'selectedOrganization'];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        // Check if this key starts with any of our prefixes
        const matchesPrefix = prefixes.some(prefix => 
          key.startsWith(prefix) || key.startsWith(`${prefix}_`)
        );
        
        if (matchesPrefix) {
          localStorage.removeItem(key);
          console.log(`Cleared dynamic key ${key} from localStorage`);
        }
      }
    }

    // Dispatch form clearing event
    const clearEvent = new Event('clearForm');
    window.dispatchEvent(clearEvent);
    
    console.log("All intake form localStorage items cleared successfully");
  } catch (error) {
    console.error('Error clearing localStorage items:', error);
  }
};

// Clear form and refresh the page
export const clearFormAndRefresh = (): void => {
  // First clear all localStorage
  clearAllLocalStorage();
  
  // Attempt to invalidate React Query cache if it's available
  try {
    // Use a type assertion to avoid TypeScript errors
    const win = window as any;
    if (win.queryClient && typeof win.queryClient.invalidateQueries === 'function') {
      win.queryClient.invalidateQueries();
      console.log('React Query cache invalidated');
    }
  } catch (error) {
    console.warn('Could not access queryClient to invalidate cache');
  }
  
  // Then trigger a page refresh to reset all React state
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

// Check if the value is a valid array
export const isValidArray = (value: any): boolean => {
  return Array.isArray(value);
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

// Clean up localStorage - remove any invalid JSON
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

// Validate types of localStorage entries
export const validateLocalStorageTypes = (): void => {
  try {
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
  } catch (error) {
    console.error('Error validating localStorage types:', error);
  }
};
