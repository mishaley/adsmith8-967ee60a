import React, { useEffect } from "react";
import OfferingSelector from "./OfferingSelector";
import OfferingFields from "./OfferingFields";
import OfferingSectionButton from "./OfferingButton";

interface OfferingSectionContentProps {
  selectedOfferingId: string;
  offeringOptions: { value: string; label: string }[];
  isOfferingsDisabled: boolean;
  offeringDetails: any;
  offeringInputRef: React.RefObject<HTMLTextAreaElement>;
  handleOfferingChange: (value: string) => void;
  handleNextClick: () => void;
  isSaving: boolean;
  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;
  selectedOrgId: string;
  setSelectedOfferingId: (value: string) => void;
}

const OfferingSectionContent: React.FC<OfferingSectionContentProps> = ({
  selectedOfferingId,
  offeringOptions,
  isOfferingsDisabled,
  offeringDetails,
  offeringInputRef,
  handleOfferingChange,
  handleNextClick,
  isSaving,
  offering,
  setOffering,
  sellingPoints,
  setSellingPoints,
  problemSolved,
  setProblemSolved,
  uniqueOffering,
  setUniqueOffering,
  selectedOrgId,
  setSelectedOfferingId
}) => {
  // Determine if fields should be read-only based on offering selection
  const isReadOnly =
    selectedOfferingId !== "" && selectedOfferingId !== "new-offering";

  useEffect(() => {
    handleOfferingChange("");
  }, [selectedOrgId]);

  return (
    <>
      <div className="flex justify-center">
        <table className="border-collapse border-transparent">
          <tbody>
            <tr className="border-transparent">
              <td colSpan={2} className="py-4 text-center">
                <OfferingSelector
                 setSelectedOfferingId={setSelectedOfferingId}
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
                isReadOnly={isReadOnly}
              />
            )}
          </tbody>
        </table>
      </div>

      {/* Next button - only show when an offering is selected or being created */}
      {selectedOfferingId === "new-offering" && (
        <OfferingSectionButton
          onClick={handleNextClick}
          isDisabled={isSaving || !offering.trim()}
          isSaving={isSaving}
        />
      )}
    </>
  );
};

export default OfferingSectionContent;
