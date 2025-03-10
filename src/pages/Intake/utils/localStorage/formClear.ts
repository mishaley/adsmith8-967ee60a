
import { STORAGE_KEYS } from './constants';

/**
 * Clear all intake form data
 */
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

/**
 * Clear form and refresh the page
 */
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
