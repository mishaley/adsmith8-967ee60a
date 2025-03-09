
import React from "react";
import CollapsibleSection from "../CollapsibleSection";
import OfferingSectionContent from "./OfferingSectionContent";
import { useOfferingSectionLogic } from "./useOfferingSectionLogic";

interface OfferingSectionProps {
  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;
}

const OfferingSection: React.FC<OfferingSectionProps> = (props) => {
  const {
    selectedOfferingId,
    offeringOptions,
    isOfferingsDisabled,
    offeringDetails,
    offeringInputRef,
    handleOfferingChange,
    handleNextClick,
    isSaving
  } = useOfferingSectionLogic(props);

  // Get the selected offering name to display when collapsed
  const selectedOffering = offeringOptions.find(opt => opt.value === selectedOfferingId)?.label;
  
  // Only show selected value if an offering is actually selected
  const selectedValue = selectedOfferingId ? (selectedOffering || props.offering) : "";

  console.log("Rendering OfferingSection with title: OFFERING");

  return (
    <CollapsibleSection title="OFFERING" selectedValue={selectedValue}>
      <OfferingSectionContent
        selectedOfferingId={selectedOfferingId}
        offeringOptions={offeringOptions}
        isOfferingsDisabled={isOfferingsDisabled}
        offeringDetails={offeringDetails}
        offeringInputRef={offeringInputRef}
        handleOfferingChange={handleOfferingChange}
        handleNextClick={handleNextClick}
        isSaving={isSaving}
        {...props}
      />
    </CollapsibleSection>
  );
};

export default React.memo(OfferingSection);
