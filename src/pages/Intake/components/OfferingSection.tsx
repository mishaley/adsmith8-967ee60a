
import React, { useRef, useEffect } from "react";
import RecordingField from "./RecordingField";
import CollapsibleSection from "./CollapsibleSection";
import SingleSelectField from "./SummaryTable/components/SingleSelectField";
import { useSummaryTableData } from "./SummaryTable/useSummaryTableData";

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

const OfferingSection: React.FC<OfferingSectionProps> = ({
  offering,
  setOffering,
  sellingPoints,
  setSellingPoints,
  problemSolved,
  setProblemSolved,
  uniqueOffering,
  setUniqueOffering
}) => {
  // Get offering dropdown data and functionality
  const {
    selectedOfferingId,
    setSelectedOfferingId,
    offeringOptions,
    isOfferingsDisabled
  } = useSummaryTableData();
  
  const offeringInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus the offering name field when "new-offering" is selected
  useEffect(() => {
    if (selectedOfferingId === "new-offering" && offeringInputRef.current) {
      // Small delay to ensure the field is rendered and visible
      const timeoutId = setTimeout(() => {
        offeringInputRef.current?.focus();
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedOfferingId]);

  return (
    <CollapsibleSection title="OFFERING">
      <div className="flex justify-center">
        <table className="border-collapse border-transparent">
          <tbody>
            <tr className="border-transparent">
              <td colSpan={2} className="py-4 text-center">
                <div className="w-72 mx-auto">
                  <SingleSelectField
                    options={offeringOptions}
                    value={selectedOfferingId}
                    onChange={setSelectedOfferingId}
                    disabled={isOfferingsDisabled}
                    placeholder=""
                    showNewOption={true}
                  />
                </div>
              </td>
            </tr>
            <RecordingField 
              label="Name just one of your offerings" 
              value={offering} 
              onChange={setOffering} 
              ref={offeringInputRef}
              placeholder=""
            />
            <RecordingField 
              label="Key Selling Points" 
              value={sellingPoints} 
              onChange={setSellingPoints} 
              placeholder=""
              helperText="What makes this offering valuable to customers?"
            />
            <RecordingField 
              label="Problem Solved" 
              value={problemSolved} 
              onChange={setProblemSolved} 
              placeholder=""
              helperText="What customer pain point does this solve?"
            />
            <RecordingField 
              label="Unique Advantages" 
              value={uniqueOffering} 
              onChange={setUniqueOffering} 
              placeholder=""
              helperText="What makes your offering different from competitors?"
            />
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
};

export default React.memo(OfferingSection);
