
import { useEffect } from "react";
import { STORAGE_KEYS, safelyRemoveInvalidLocalStorage } from "../utils/localStorageUtils";

interface UseOfferingInitializationProps {
  offeringOptions: { value: string; label: string }[];
  isOfferingsDisabled: boolean;
  selectedOfferingId: string;
  setSelectedOfferingId: (id: string) => void;
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
  // Clean up invalid localStorage entries on component mount
  useEffect(() => {
    // This will check and remove any invalid JSON in localStorage for offering keys
    safelyRemoveInvalidLocalStorage(STORAGE_KEYS.OFFERING);
  }, []);

  // Load from localStorage on initial render if nothing is selected
  useEffect(() => {
    // Only attempt to load from localStorage if no offering is currently selected
    // and options are available (meaning an org is selected)
    if (!selectedOfferingId && !isOfferingsDisabled && offeringOptions.length > 0) {
      try {
        const storedOfferingId = localStorage.getItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
        
        // Check if we have a stored ID and it exists in current options
        if (storedOfferingId) {
          // For "new-offering" we can always apply it if an org is selected
          if (storedOfferingId === "new-offering") {
            if (selectedOrgId) {
              console.log(`Applying stored "new-offering" value since org is selected`);
              setSelectedOfferingId(storedOfferingId);
            }
          } else {
            // For existing offerings, make sure the ID exists in the options
            const optionExists = offeringOptions.some(option => option.value === storedOfferingId);
            if (optionExists) {
              console.log(`Initializing with stored offering ID: ${storedOfferingId}`);
              setSelectedOfferingId(storedOfferingId);
              
              // If we're selecting an existing offering, fetch its details
              refetchOfferingDetails();
            } else {
              console.log(`Stored offering ID ${storedOfferingId} not found in options`);
              // Clear invalid stored ID
              localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing offering from localStorage:", error);
        // If there's an error, remove potentially corrupted data
        localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
      }
    }
  }, [selectedOfferingId, isOfferingsDisabled, offeringOptions, selectedOrgId, setSelectedOfferingId, refetchOfferingDetails]);
};
