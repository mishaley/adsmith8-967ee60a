
import React, { useEffect } from "react";
import SingleSelectField from "../SummaryTable/components/SingleSelectField";
import { STORAGE_KEYS } from "../../utils/localStorage";
import { logDebug, logError, logInfo } from "@/utils/logging";
import { dispatchDedupedEvent } from "@/utils/eventUtils";

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
  placeholder = ""
}) => {
  // Debug logs
  useEffect(() => {
    logDebug(`OfferingSelector rendered with state:`, 'ui');
    logDebug(`- Selected ID: ${selectedOfferingId || "none"}`, 'ui');
    logDebug(`- Disabled: ${isOfferingsDisabled}`, 'ui');
    logDebug(`- Options count: ${offeringOptions.length}`, 'ui');
  }, [isOfferingsDisabled, offeringOptions.length, selectedOfferingId]);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      if (!selectedOfferingId && !isOfferingsDisabled && offeringOptions.length > 0) {
        const storedValue = localStorage.getItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
        
        if (storedValue) {
          logInfo(`Found stored offering ID: ${storedValue}, checking if valid`, 'ui');
          
          // Validate stored value exists in current options or is "new-offering"
          const isValidOption = offeringOptions.some(option => option.value === storedValue) || 
                              storedValue === "new-offering";
          
          if (isValidOption) {
            logInfo(`Applying stored offering ID: ${storedValue}`, 'ui');
            handleOfferingChange(storedValue);
          } else {
            logInfo(`Stored offering ID ${storedValue} not found in options, clearing`, 'ui');
            localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
          }
        }
      }
    } catch (error) {
      logError("Error initializing from localStorage", 'ui');
      localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
    }
  }, [selectedOfferingId, handleOfferingChange, offeringOptions, isOfferingsDisabled]);

  // Listen for clear form event
  useEffect(() => {
    const handleClearForm = () => {
      logDebug("Clear form event detected in OfferingSelector", 'ui');
      if (selectedOfferingId) {
        handleOfferingChange("");
      }
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => window.removeEventListener('clearForm', handleClearForm);
  }, [selectedOfferingId, handleOfferingChange]);

  // Wrap handleOfferingChange to dispatch event when offering changes
  const onOfferingChange = (value: string) => {
    // If the offering has changed, dispatch an event
    if (value !== selectedOfferingId) {
      // Call the original handler
      handleOfferingChange(value);
      
      // Dispatch an event to notify other components about the offering change
      dispatchDedupedEvent("offeringChanged", { offeringId: value });
      logDebug(`Dispatched offeringChanged event with ID: ${value}`, 'events');
    } else {
      // If it's the same value, just call the handler without dispatching
      handleOfferingChange(value);
    }
  };

  return (
    <div className="w-72 mx-auto">
      <SingleSelectField
        options={offeringOptions}
        value={selectedOfferingId}
        onChange={onOfferingChange}
        disabled={isOfferingsDisabled}
        placeholder={placeholder}
        showNewOption={true}
      />
    </div>
  );
};

export default OfferingSelector;
