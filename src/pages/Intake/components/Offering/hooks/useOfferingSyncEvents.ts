
import { useEffect } from "react";
import { logDebug, logError } from "@/utils/logging";

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
        
        if (offeringId !== undefined && offeringId !== selectedOfferingId) {
          logDebug(`Received offering changed event with ID: ${offeringId}`);
          setSelectedOfferingId(offeringId);
        }
      } catch (error) {
        logError("Error handling offering changed event:", error);
      }
    };
    
    window.addEventListener('offeringChanged', handleOfferingChanged as EventListener);
    
    return () => {
      window.removeEventListener('offeringChanged', handleOfferingChanged as EventListener);
    };
  }, [selectedOfferingId, setSelectedOfferingId]);
};
