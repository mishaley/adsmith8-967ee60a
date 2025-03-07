
import React from "react";
import CollapsibleSection from "../CollapsibleSection";
import { OfferingButton } from "../Organization";
import OfferingSelector from "./OfferingSelector";
import OfferingFields from "./OfferingFields";
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

  const {
    offering,
    setOffering,
    sellingPoints,
    setSellingPoints,
    problemSolved,
    setProblemSolved,
    uniqueOffering,
    setUniqueOffering
  } = props;

  return (
    <CollapsibleSection title="OFFERING">
      <div className="flex justify-center">
        <table className="border-collapse border-transparent">
          <tbody>
            <tr className="border-transparent">
              <td colSpan={2} className="py-4 text-center">
                <OfferingSelector
                  selectedOfferingId={selectedOfferingId}
                  handleOfferingChange={handleOfferingChange}
                  offeringOptions={offeringOptions}
                  isOfferingsDisabled={isOfferingsDisabled}
                />
              </td>
            </tr>
            
            {(selectedOfferingId === "new-offering" || !!offeringDetails) && (
              <OfferingFields
                offering={offering}
                setOffering={setOffering}
                sellingPoints={sellingPoints}
                setSellingPoints={setSellingPoints}
                problemSolved={problemSolved}
                setProblemSolved={setProblemSolved}
                uniqueOffering={uniqueOffering}
                setUniqueOffering={setUniqueOffering}
                offeringInputRef={offeringInputRef}
              />
            )}
          </tbody>
        </table>
      </div>
      
      {/* Next button - only show when an offering is selected or being created */}
      {(selectedOfferingId === "new-offering" || !!offeringDetails) && (
        <OfferingButton 
          onClick={handleNextClick}
          isDisabled={isSaving || !offering.trim()}
          isCreating={isSaving}
        />
      )}
    </CollapsibleSection>
  );
};

export default React.memo(OfferingSection);
