
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
  LAST_ROUTE: 'adsmith_last_route'  // Added for route tracking
};

// Generic save function
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

// Generic load function with type safety
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
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
    // Only clear our app-specific items, not everything in localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all localStorage items:', error);
  }
};
