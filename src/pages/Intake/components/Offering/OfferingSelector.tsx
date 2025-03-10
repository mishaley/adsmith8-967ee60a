
import React, { useEffect } from "react";
import SingleSelectField from "../SummaryTable/components/SingleSelectField";
import { STORAGE_KEYS, isValidJSON } from "../../utils/localStorage";
import { logDebug, logError, logWarning } from "@/utils/logging";

interface OfferingSelectorProps {
  selectedOfferingId: string;
  handleOfferingChange: (value: string) => void;
  offeringOptions: { value: string; label: string }[];
  isOfferingsDisabled: boolean;
  placeholder?: string;
}

const OfferingSelector: React.FC<OfferingSelectorProps> = ({
  selectedOfferingId,
  handleOfferingChange,
  offeringOptions,
  isOfferingsDisabled,
  placeholder = "Select an offering"
}) => {
  // Load from localStorage on initial render
  useEffect(() => {
    try {
      if (!selectedOfferingId && !isOfferingsDisabled && offeringOptions.length > 0) {
        const storedValue = localStorage.getItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
        
        // Validate stored value
        if (storedValue) {
          // Only apply if it's a valid string
          // Check if the stored ID exists in current options or is "new-offering"
          const optionExists = offeringOptions.some(option => option.value === storedValue);
          
          if (optionExists || storedValue === "new-offering") {
            logDebug(`Applying stored offering ID from localStorage: ${storedValue}`);
            handleOfferingChange(storedValue);
          } else {
            logWarning(`Stored offering ID ${storedValue} not found in options, not applying`);
            // Clean up invalid stored value
            localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
          }
        }
      }
    } catch (error) {
      logError("Error initializing from localStorage in OfferingSelector:", error);
      // Clean up potentially corrupted data
      localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
    }
  }, [selectedOfferingId, handleOfferingChange, offeringOptions, isOfferingsDisabled]);

  // Listen for clear form event
  useEffect(() => {
    const handleClearForm = () => {
      logDebug("Clear form event detected in OfferingSelector");
      if (selectedOfferingId) {
        handleOfferingChange("");
      }
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => window.removeEventListener('clearForm', handleClearForm);
  }, [selectedOfferingId, handleOfferingChange]);

  return (
    <div className="w-72 mx-auto">
      <SingleSelectField
        options={offeringOptions}
        value={selectedOfferingId}
        onChange={handleOfferingChange}
        disabled={isOfferingsDisabled}
        placeholder={placeholder}
        showNewOption={true}
      />
    </div>
  );
};

export default OfferingSelector;
