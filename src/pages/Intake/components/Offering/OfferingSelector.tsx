
import React from "react";
import SingleSelectField from "../SummaryTable/components/SingleSelectField";

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
  // Use localStorage value on initial render if available
  React.useEffect(() => {
    const storedOfferingId = localStorage.getItem("adsmith_offering_selectedId");
    if (storedOfferingId && storedOfferingId !== selectedOfferingId && handleOfferingChange) {
      handleOfferingChange(storedOfferingId);
    }
  }, []);

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
