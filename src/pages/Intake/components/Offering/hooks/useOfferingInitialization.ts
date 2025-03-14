
import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "../../../utils/localStorage";
import { logDebug, logInfo, logWarning } from "@/utils/logging";

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

  // Load the initial offering from localStorage on mount or when org changes
  useEffect(() => {
    const STORAGE_KEY = `${STORAGE_KEYS.OFFERING}_selectedId`;
    
    if (selectedOrgId && (isLoadingFromStorage || !initialLoadComplete) && offeringOptions.length > 0) {
      const storedOfferingId = localStorage.getItem(STORAGE_KEY);
      
      if (storedOfferingId) {
        logInfo(`Attempting to load initial offering ID from storage: ${storedOfferingId}`);
        
        // Validate if the stored offering ID exists in the current options
        const offeringExists = offeringOptions.some(option => option.value === storedOfferingId);
        
        if (offeringExists || storedOfferingId === "new-offering") {
          logInfo(`Valid offering ID found in storage: ${storedOfferingId}`);
          
          if (storedOfferingId !== selectedOfferingId) {
            logInfo(`Setting offering ID to stored value: ${storedOfferingId}`);
            setSelectedOfferingId(storedOfferingId);
            
            // If it's a real offering ID (not "new-offering"), we should load its details
            if (storedOfferingId !== "new-offering") {
              logDebug("Fetching details for stored offering");
              refetchOfferingDetails();
            }
          }
        } else {
          logWarning(`Stored offering ID ${storedOfferingId} not found in options, not applying`);
          // Clear invalid stored offering ID
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        logDebug("No stored offering ID found");
      }
      
      setInitialLoadComplete(true);
      setIsLoadingFromStorage(false);
    }
  }, [
    isLoadingFromStorage,
    initialLoadComplete, 
    isOfferingsDisabled, 
    offeringOptions,
    refetchOfferingDetails, 
    selectedOfferingId,
    setSelectedOfferingId,
    selectedOrgId
  ]);

  // Reset the loading state when organization changes
  useEffect(() => {
    if (selectedOrgId) {
      logInfo(`Organization changed to ${selectedOrgId}, resetting offering initialization state`);
      setIsLoadingFromStorage(true);
      setInitialLoadComplete(false);
    } else {
      // Clear offering when org is cleared
      if (selectedOfferingId) {
        logInfo("Clearing offering selection as organization was cleared");
        setSelectedOfferingId("");
      }
    }
  }, [selectedOrgId, selectedOfferingId, setSelectedOfferingId]);

  // Helper function to manually trigger reload from storage
  const reloadFromStorage = useCallback(() => {
    logInfo("Manually triggering reload from storage");
    setIsLoadingFromStorage(true);
    setInitialLoadComplete(false);
  }, []);

  return {
    initialLoadComplete,
    isLoadingFromStorage,
    reloadFromStorage
  };
};
