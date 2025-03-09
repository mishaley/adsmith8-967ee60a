
import React, { useEffect } from "react";
import SingleSelectField from "../SummaryTable/components/SingleSelectField";
import { STORAGE_KEYS } from "../../utils/localStorageUtils";

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
    const storedOfferingId = localStorage.getItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
    if (storedOfferingId && storedOfferingId !== selectedOfferingId && !isOfferingsDisabled) {
      // Check if the stored ID exists in current options
      const optionExists = offeringOptions.some(option => option.value === storedOfferingId);
      
      // Only apply if the option exists or if it's the special "new-offering" value
      if (optionExists || storedOfferingId === "new-offering") {
        console.log(`Applying stored offering ID from localStorage: ${storedOfferingId}`);
        handleOfferingChange(storedOfferingId);
      } else {
        console.log(`Stored offering ID ${storedOfferingId} not found in options, not applying`);
      }
    }
  }, [selectedOfferingId, handleOfferingChange, offeringOptions, isOfferingsDisabled]);

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
