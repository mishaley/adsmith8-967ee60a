
import { STORAGE_KEYS } from './constants';
import { logInfo, logError } from '@/utils/logging';
import { dispatchDedupedEvent } from '@/utils/eventUtils';

/**
 * Clear all form-related data from localStorage and refresh the page
 */
export const clearFormAndRefresh = () => {
  try {
    logInfo('Starting form data clear', 'localStorage');
    
    // First, clear all form-related keys
    Object.values(STORAGE_KEYS).forEach(prefix => {
      let clearedCount = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          localStorage.removeItem(key);
          clearedCount++;
        }
      }
      if (clearedCount > 0) {
        logInfo(`Cleared ${clearedCount} keys with prefix: ${prefix}`, 'localStorage');
      }
    });
    
    // Set a timestamp for the clear to help with post-refresh cleanup
    localStorage.setItem('last_form_clear', Date.now().toString());
    
    // Dispatch an event to notify components about the clear
    dispatchDedupedEvent('clearForm', {});
    
    // Give a small delay for components to react, then refresh
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (error) {
    logError('Error during form clear:', 'localStorage', error);
    // Try to refresh anyway
    window.location.reload();
  }
};
