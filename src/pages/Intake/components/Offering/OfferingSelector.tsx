
import React from "react";
import SingleSelectField from "../SummaryTable/components/SingleSelectField";

interface OfferingSelectorProps {
  selectedOfferingId: string;
  handleOfferingChange: (value: string) => void;
  offeringOptions: { value: string; label: string }[];
  isOfferingsDisabled: boolean;
}

const OfferingSelector: React.FC<OfferingSelectorProps> = ({
  selectedOfferingId,
  handleOfferingChange,
  offeringOptions,
  isOfferingsDisabled
}) => {
  return (
    <div className="w-72 mx-auto">
      <SingleSelectField
        options={offeringOptions}
        value={selectedOfferingId}
        onChange={handleOfferingChange}
        disabled={isOfferingsDisabled}
        placeholder=""
        showNewOption={true}
      />
    </div>
  );
};

export default OfferingSelector;
