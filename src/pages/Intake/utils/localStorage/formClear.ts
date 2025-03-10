
import { STORAGE_KEYS } from './constants';
import { logInfo } from '@/utils/logging';

/**
 * Clear all form-related data from localStorage and refresh the page
 */
export const clearFormAndRefresh = () => {
  try {
    logInfo('Starting form data clear');
    
    // First, clear all form-related keys
    Object.values(STORAGE_KEYS).forEach(prefix => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          localStorage.removeItem(key);
          logInfo(`Cleared key: ${key}`);
        }
      }
    });
    
    // Set a timestamp for the clear to help with post-refresh cleanup
    localStorage.setItem('last_form_clear', Date.now().toString());
    
    // Dispatch an event to notify components about the clear
    window.dispatchEvent(new Event('clearForm'));
    
    // Give a small delay for components to react, then refresh
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (error) {
    console.error('Error during form clear:', error);
    // Try to refresh anyway
    window.location.reload();
  }
};
