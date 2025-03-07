
import React, { useRef, useEffect } from "react";
import FormField from "./FormField";
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
                    placeholder="Select an offering"
                    showNewOption={true}
                  />
                </div>
              </td>
            </tr>
            <FormField 
              label="Name just one of your offerings" 
              value={offering} 
              onChange={e => setOffering(e.target.value)} 
              ref={offeringInputRef}
            />
            <RecordingField 
              label="Key Selling Points" 
              helperText="Main reasons why customers buy this offering" 
              value={sellingPoints} 
              onChange={setSellingPoints} 
              placeholder="Speak for at least 30 seconds" 
            />
            <RecordingField 
              label="Problem Solved" 
              helperText="How does this offering help your customers?" 
              value={problemSolved} 
              onChange={setProblemSolved} 
              placeholder="Speak for at least 30 seconds" 
            />
            <RecordingField 
              label="Unique Advantages" 
              helperText="How is this offering better than alternatives?" 
              value={uniqueOffering} 
              onChange={setUniqueOffering} 
              placeholder="Speak for at least 30 seconds" 
            />
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
};

export default React.memo(OfferingSection);
