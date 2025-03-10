
import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../../../utils/localStorageUtils";
import { logDebug, logInfo } from "@/utils/logging";

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
    if (isLoadingFromStorage && !isOfferingsDisabled && offeringOptions.length > 0) {
      const storedOfferingId = localStorage.getItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
      
      if (storedOfferingId) {
        logDebug(`Attempting to load initial offering ID from storage: ${storedOfferingId}`);
        
        // Validate if the stored offering ID exists in the current options
        const offeringExists = offeringOptions.some(option => option.value === storedOfferingId);
        
        if (offeringExists || storedOfferingId === "new-offering") {
          logDebug(`Valid offering ID found in storage: ${storedOfferingId}`);
          setSelectedOfferingId(storedOfferingId);
          
          // If it's a real offering ID (not "new-offering"), we should load its details
          if (storedOfferingId !== "new-offering") {
            refetchOfferingDetails();
          }
        } else {
          logDebug(`Stored offering ID ${storedOfferingId} not found in options, not applying`);
          // Clear invalid stored offering ID
          localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
        }
      }
      
      setInitialLoadComplete(true);
      setIsLoadingFromStorage(false);
    }
  }, [
    isLoadingFromStorage, 
    isOfferingsDisabled, 
    offeringOptions,
    refetchOfferingDetails, 
    setSelectedOfferingId
  ]);

  // Reset the loading state when organization changes
  useEffect(() => {
    // When the organization changes, we should reset the state to load offerings
    if (selectedOrgId) {
      logInfo(`Organization changed to ${selectedOrgId}, resetting offering initialization state`);
      setIsLoadingFromStorage(true);
      setInitialLoadComplete(false);
    }
  }, [selectedOrgId]);

  return {
    initialLoadComplete,
    isLoadingFromStorage
  };
};
