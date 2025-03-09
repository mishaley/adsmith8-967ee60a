
import { useEffect } from "react";

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
      const customEvent = event as CustomEvent;
      const { offeringId } = customEvent.detail;
      
      if (offeringId && offeringId !== selectedOfferingId) {
        console.log(`Received offering changed event with ID: ${offeringId}`);
        setSelectedOfferingId(offeringId);
      }
    };
    
    window.addEventListener('offeringChanged', handleOfferingChanged as EventListener);
    
    return () => {
      window.removeEventListener('offeringChanged', handleOfferingChanged as EventListener);
    };
  }, [selectedOfferingId, setSelectedOfferingId]);
};
