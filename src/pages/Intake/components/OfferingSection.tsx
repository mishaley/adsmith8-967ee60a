
import React, { useRef, useEffect } from "react";
import RecordingField from "./RecordingField";
import CollapsibleSection from "./CollapsibleSection";
import SingleSelectField from "./SummaryTable/components/SingleSelectField";
import { useSummaryTableData } from "./SummaryTable/useSummaryTableData";
import { useOfferingDetails } from "./SummaryTable/hooks/useOfferingDetails";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  
  // Get offering dropdown data and functionality
  const {
    selectedOfferingId,
    setSelectedOfferingId,
    offeringOptions,
    isOfferingsDisabled
  } = useSummaryTableData();
  
  // Get offering details if an existing offering is selected
  const { offeringDetails, refetchOfferingDetails } = useOfferingDetails(selectedOfferingId);
  
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

  // Update local form fields when an existing offering is selected
  useEffect(() => {
    if (offeringDetails) {
      setOffering(offeringDetails.offering_name || "");
      setSellingPoints(offeringDetails.offering_keysellingpoints || "");
      setProblemSolved(offeringDetails.offering_problemsolved || "");
      setUniqueOffering(offeringDetails.offering_uniqueadvantages || "");
    } else if (selectedOfferingId === "new-offering") {
      // Clear fields for new offering
      setOffering("");
      setSellingPoints("");
      setProblemSolved("");
      setUniqueOffering("");
    }
  }, [
    offeringDetails, 
    selectedOfferingId, 
    setOffering, 
    setSellingPoints, 
    setProblemSolved, 
    setUniqueOffering
  ]);

  // Effect to refetch offering details when the user selects a different offering
  useEffect(() => {
    if (selectedOfferingId && selectedOfferingId !== "new-offering") {
      refetchOfferingDetails();
    }
  }, [selectedOfferingId, refetchOfferingDetails]);

  // Handle offering change
  const handleOfferingChange = (value: string) => {
    setSelectedOfferingId(value);
    
    if (!value) {
      // Clear fields when no offering is selected
      setOffering("");
      setSellingPoints("");
      setProblemSolved("");
      setUniqueOffering("");
    } else if (value === "new-offering") {
      toast({
        title: "Creating a new offering",
        description: "Please fill in the offering details below.",
      });
    }
  };

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
                    onChange={handleOfferingChange}
                    disabled={isOfferingsDisabled}
                    placeholder=""
                    showNewOption={true}
                  />
                </div>
              </td>
            </tr>
            
            {(selectedOfferingId === "new-offering" || !!offeringDetails) && (
              <>
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
              </>
            )}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
};

export default React.memo(OfferingSection);
