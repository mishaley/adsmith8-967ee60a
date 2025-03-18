
import { logInfo, logError } from "@/utils/logging";
import { STORAGE_KEYS } from "./constants";
import { clearLocalStorageByPrefix } from "./core";
import { cleanupOrphanedPersonaSelections } from "./cleanup";

/**
 * Clear all form data (for "Clear Form" button)
 */
export const clearFormAndRefresh = () => {
  try {
    // Clear all localStorage data prefixed with adsmith_
    const keys = Object.values(STORAGE_KEYS);
    keys.forEach(key => {
      clearLocalStorageByPrefix(key);
    });
    
    // Clear other related data
    clearLocalStorageByPrefix('persona_selectedIds_');
    
    // Log successful clear
    logInfo("All form data cleared from localStorage", 'localStorage');
    
    // Dispatch event to notify components
    const clearEvent = new CustomEvent('clearForm');
    window.dispatchEvent(clearEvent);
    
    // Refresh the page
    window.location.reload();
  } catch (error) {
    logError("Error clearing form data:", 'localStorage', error);
  }
};

/**
 * Clear persona-related data when an offering changes
 */
export const clearPersonaDataForOffering = (offeringId: string) => {
  if (!offeringId) return;
  
  try {
    // Clear the specific persona selections for this offering
    localStorage.removeItem(`persona_selectedIds_${offeringId}`);
    
    // Also clean up any orphaned persona selections
    cleanupOrphanedPersonaSelections();
    
    logInfo(`Cleared persona data for offering: ${offeringId}`, 'localStorage');
  } catch (error) {
    logError(`Error clearing persona data for offering ${offeringId}:`, 'localStorage', error);
  }
};
