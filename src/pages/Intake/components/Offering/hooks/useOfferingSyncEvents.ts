import { useEffect } from "react";
import { logDebug, logInfo } from "@/utils/logging";
import { STORAGE_KEYS } from "../../../utils/localStorage";

interface UseOfferingSyncEventsProps {
  selectedOfferingId: string;
  setSelectedOfferingId: (value: string) => void;
}

export const useOfferingSyncEvents = ({
  selectedOfferingId,
  setSelectedOfferingId
}: UseOfferingSyncEventsProps) => {
  // Listen for offering selection changes from other components
  useEffect(() => {
    const handleOfferingChanged = (event: CustomEvent) => {
      try {
        const { offeringId } = event.detail;
        
        if (!offeringId) {
          logDebug("Received offeringChanged event with missing offeringId");
          return;
        }

        if (offeringId !== selectedOfferingId) {
          logInfo(`External offering change detected: ${offeringId}`);
          setSelectedOfferingId(offeringId);
          
          // Also update localStorage to keep things in sync
          try {
            localStorage.setItem(`${STORAGE_KEYS.OFFERING}_selectedId`, offeringId);
          } catch (e) {
            console.error("Error saving external offering change to localStorage:", e);
          }
        }
      } catch (error) {
        console.error("Error handling external offering change event:", error);
      }
    };

    window.addEventListener('offeringChanged', handleOfferingChanged as EventListener);

    return () => {
      window.removeEventListener('offeringChanged', handleOfferingChanged as EventListener);
    };
  }, [selectedOfferingId, setSelectedOfferingId]);

  // Listen for clear form events
  useEffect(() => {
    const handleClearForm = () => {
      if (selectedOfferingId) {
        logInfo("Clearing offering selection due to form clear event");
        setSelectedOfferingId("");
        
        // Also update localStorage to keep things in sync
        try {
          localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
        } catch (e) {
          console.error("Error removing offering from localStorage during clear:", e);
        }
      }
    };
    
    window.addEventListener('clearForm', handleClearForm);
    
    return () => {
      window.removeEventListener('clearForm', handleClearForm);
    };
  }, [selectedOfferingId, setSelectedOfferingId]);

  return null; // This hook doesn't return anything
};
