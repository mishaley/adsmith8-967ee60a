
import { useEffect } from "react";
import { logDebug, logError, logInfo } from "@/utils/logging";
import { dispatchDedupedEvent } from "@/utils/eventUtils";

interface UseOfferingSyncEventsProps {
  selectedOfferingId: string;
  setSelectedOfferingId: (value: string) => void;
}

export const useOfferingSyncEvents = ({
  selectedOfferingId,
  setSelectedOfferingId
}: UseOfferingSyncEventsProps) => {
  // Sync between components using window events
  useEffect(() => {
    const handleOfferingChanged = (event: Event) => {
      try {
        const customEvent = event as CustomEvent;
        if (!customEvent?.detail) {
          logDebug("Received offeringChanged event with no detail");
          return;
        }
        
        const { offeringId } = customEvent.detail;
        
        if (offeringId === undefined) {
          logDebug("Received offeringChanged event with undefined offeringId");
          return;
        }
        
        if (offeringId === selectedOfferingId) {
          logDebug(`Skipping offeringChanged event as ID is unchanged: ${offeringId}`);
          return;
        }
        
        logInfo(`Received offering changed event with ID: ${offeringId}`);
        setSelectedOfferingId(offeringId);
      } catch (error) {
        logError("Error handling offering changed event:", error);
      }
    };
    
    window.addEventListener('offeringChanged', handleOfferingChanged as EventListener);
    
    return () => {
      window.removeEventListener('offeringChanged', handleOfferingChanged as EventListener);
    };
  }, [selectedOfferingId, setSelectedOfferingId]);

  // Helper to notify other components about the offering change
  const notifyOfferingChange = (offeringId: string) => {
    if (offeringId === selectedOfferingId) return;
    
    logInfo(`Broadcasting offering change to: ${offeringId}`);
    dispatchDedupedEvent('offeringChanged', { offeringId });
  };
  
  return {
    notifyOfferingChange
  };
};
