
import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../../../utils/localStorageUtils";

interface UseOfferingInitializationProps {
  offeringOptions: { value: string; label: string }[];
  isOfferingsDisabled: boolean;
  selectedOfferingId: string;
  setSelectedOfferingId: (value: string) => void;
  refetchOfferingDetails: () => void;
  selectedOrgId: string;
}

export const useOfferingInitialization = ({
  offeringOptions,
  isOfferingsDisabled,
  selectedOfferingId,
  setSelectedOfferingId,
  refetchOfferingDetails,
  selectedOrgId
}: UseOfferingInitializationProps) => {
  // Track if initial loading is complete
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(true);

  // Load the initial offering from localStorage on mount - only once
  useEffect(() => {
    if (isLoadingFromStorage && !initialLoadComplete && offeringOptions.length > 0) {
      const storedOfferingId = localStorage.getItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
      
      if (storedOfferingId && !isOfferingsDisabled) {
        console.log(`Attempting to load initial offering ID from storage: ${storedOfferingId}`);
        
        // Validate if the stored offering ID exists in the current options
        const offeringExists = offeringOptions.some(option => option.value === storedOfferingId);
        
        if (offeringExists || storedOfferingId === "new-offering") {
          console.log(`Valid offering ID found in storage: ${storedOfferingId}`);
          setSelectedOfferingId(storedOfferingId);
          
          // If it's a real offering ID (not "new-offering"), we should load its details
          if (storedOfferingId !== "new-offering") {
            refetchOfferingDetails();
          }
        } else {
          console.log(`Stored offering ID ${storedOfferingId} not found in options, not applying`);
          // Clear invalid stored offering ID
          localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
        }
      }
      
      setInitialLoadComplete(true);
      setIsLoadingFromStorage(false);
    }
  }, [
    initialLoadComplete, 
    isOfferingsDisabled, 
    offeringOptions,
    refetchOfferingDetails, 
    setSelectedOfferingId, 
    isLoadingFromStorage
  ]);

  // Reset the loading state when organization changes
  useEffect(() => {
    if (selectedOrgId && initialLoadComplete) {
      setIsLoadingFromStorage(true);
    }
  }, [selectedOrgId, initialLoadComplete]);

  return {
    initialLoadComplete,
    isLoadingFromStorage
  };
};
