
import { STORAGE_KEYS } from './constants';
import { logInfo } from '@/utils/logging';

/**
 * Clean up expired or inconsistent localStorage data
 */
export const cleanupLocalStorage = () => {
  try {
    // Get the last form clear timestamp
    const lastClearTimestamp = localStorage.getItem('last_form_clear');
    
    // If there's no timestamp, no need to clean up
    if (!lastClearTimestamp) return;
    
    // Parse the timestamp and compare with current time
    const clearTime = parseInt(lastClearTimestamp, 10);
    const now = Date.now();
    
    // If the clear happened in the last 5 seconds, do extra cleanup
    if (now - clearTime < 5000) {
      // Perform a more thorough cleanup to catch any missed keys
      logInfo('Performing post-clear cleanup');
      
      // Check each key in localStorage and remove any that belongs to our form
      Object.values(STORAGE_KEYS).forEach(prefix => {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            localStorage.removeItem(key);
            logInfo(`Cleanup removed key: ${key}`);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error during localStorage cleanup:', error);
  }
};

/**
 * Validate the types of data in localStorage
 * to ensure they match what we expect
 */
export const validateLocalStorageTypes = () => {
  try {
    // Check array types
    const arrayKeys = [
      `${STORAGE_KEYS.LOCATION}_countries`,
      `${STORAGE_KEYS.LANGUAGE}_selected`,
      `${STORAGE_KEYS.LOCATION}_excluded_countries`,
      `${STORAGE_KEYS.MESSAGES}_types`,
      `${STORAGE_KEYS.PERSONAS}_data`
    ];
    
    arrayKeys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const parsed = JSON.parse(item);
          if (!Array.isArray(parsed)) {
            logInfo(`Found invalid type for ${key}, expected array but got ${typeof parsed}. Removing.`);
            localStorage.removeItem(key);
          }
        } catch (e) {
          logInfo(`Found invalid JSON for ${key}, removing`);
          localStorage.removeItem(key);
        }
      }
    });
    
    // Check object types
    const objectKeys = [
      `${STORAGE_KEYS.MESSAGES}_generated`,
      `${STORAGE_KEYS.SECTION_STATES}`
    ];
    
    objectKeys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const parsed = JSON.parse(item);
          if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
            logInfo(`Found invalid type for ${key}, expected object but got ${typeof parsed}. Removing.`);
            localStorage.removeItem(key);
          }
        } catch (e) {
          logInfo(`Found invalid JSON for ${key}, removing`);
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error during localStorage type validation:', error);
  }
};
