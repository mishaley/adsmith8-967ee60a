
import { logDebug, logWarning, logInfo } from "@/utils/logging";
import { STORAGE_KEYS } from "./constants";

/**
 * Clean up persona selections that no longer have associated offerings
 */
export const cleanupOrphanedPersonaSelections = () => {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('persona_selectedIds_')) {
        keys.push(key);
      }
    }

    // First check if we have an active offering
    const activeOfferingId = localStorage.getItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
    
    let cleanupCount = 0;
    
    // Remove persona selections for offerings that are not the active one
    keys.forEach(key => {
      // Extract the offering ID from the key
      // Format is 'persona_selectedIds_OFFERING_ID'
      const keyParts = key.split('_');
      if (keyParts.length >= 3) {
        const offeringId = keyParts.slice(2).join('_'); // In case ID contains underscores
        
        // If this is for a different offering than the active one, or there is no active offering
        if (!activeOfferingId || offeringId !== activeOfferingId) {
          localStorage.removeItem(key);
          cleanupCount++;
        }
      }
    });
    
    if (cleanupCount > 0) {
      logInfo(`Cleaned up ${cleanupCount} orphaned persona selections`, 'localStorage');
    }
  } catch (error) {
    logWarning("Error cleaning up orphaned persona selections:", 'localStorage', error);
  }
};

/**
 * Clean up invalid or outdated localStorage entries
 */
export const cleanupLocalStorage = () => {
  try {
    // Clean up specific data types
    cleanupOrphanedPersonaSelections();
    
    // Log cleanup completion
    logDebug("localStorage cleanup complete", 'localStorage');
  } catch (error) {
    logWarning("Error during localStorage cleanup:", 'localStorage', error);
  }
};
