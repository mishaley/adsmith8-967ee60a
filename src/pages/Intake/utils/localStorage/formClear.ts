
import { STORAGE_KEYS } from './constants';
import { logInfo, logError } from '@/utils/logging';
import { dispatchDedupedEvent } from '@/utils/eventUtils';

/**
 * Clear all form-related data from localStorage and refresh the page
 */export const clearFormAndRefresh = () => {
  try {
    logInfo('Starting form data clear', 'localStorage');
    localStorage.clear();
    localStorage.setItem('last_form_clear', Date.now().toString());
    window.dispatchEvent(new CustomEvent('clearForm'));
    setTimeout(() => {
      window.location.reload(true); // `true` forces a reload from the server, not the cache
    }, 300); // 300ms delay to allow components to react to the event
  } catch (error) {
    logError('Error during form clear:', 'localStorage', error);
    window.location.reload(true);
  }
};
