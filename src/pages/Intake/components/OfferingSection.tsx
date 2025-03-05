
import React from "react";
import FormField from "./FormField";
import RecordingField from "./RecordingField";
import CollapsibleSection from "./CollapsibleSection";
import MultiSelectField from "./SummaryTable/components/MultiSelectField";
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
    selectedOrgId,
    selectedOfferingIds,
    setSelectedOfferingIds,
    offeringOptions,
    isOfferingsDisabled
  } = useSummaryTableData();

  return (
    <CollapsibleSection title="OFFERING">
      <div className="flex justify-center">
        <table className="border-collapse border-transparent">
          <tbody>
            <tr className="border-transparent">
              <td colSpan={2} className="py-4 text-center">
                <div className="w-72 mx-auto">
                  <MultiSelectField
                    options={offeringOptions}
                    value={selectedOfferingIds}
                    onChange={setSelectedOfferingIds}
                    disabled={isOfferingsDisabled}
                    placeholder="Select offerings"
                  />
                </div>
              </td>
            </tr>
            <FormField 
              label="Name just one of your offerings" 
              helperText="We can add more later" 
              value={offering} 
              onChange={e => setOffering(e.target.value)} 
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

export default OfferingSection;
