
import { STORAGE_KEYS } from './constants';
import { logInfo, logError } from '@/utils/logging';
import { dispatchDedupedEvent } from '@/utils/eventUtils';

/**
 * Clear all form-related data from localStorage and refresh the page
 */
export const clearFormAndRefresh = () => {
  try {
    logInfo('Starting form data clear', 'localStorage');
    localStorage.clear();
    localStorage.setItem('last_form_clear', Date.now().toString());
    window.dispatchEvent(new CustomEvent('clearForm'));
    setTimeout(() => {
      window.location.reload(); // Remove the 'true' parameter as it's not expected
    }, 300); // 300ms delay to allow components to react to the event
  } catch (error) {
    logError('Error during form clear:', 'localStorage', error);
    window.location.reload(); // Remove the 'true' parameter here as well
  }
};
