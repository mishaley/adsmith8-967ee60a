
import { useState, useEffect, useRef } from "react";
import { useSummaryTableData } from "../SummaryTable/useSummaryTableData";
import { useOfferingDetails } from "../SummaryTable/hooks/useOfferingDetails";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseOfferingSectionLogicProps {
  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;
}

export const useOfferingSectionLogic = ({
  offering,
  setOffering,
  sellingPoints,
  setSellingPoints,
  problemSolved,
  setProblemSolved,
  uniqueOffering,
  setUniqueOffering
}: UseOfferingSectionLogicProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Get offering dropdown data and functionality
  const {
    selectedOfferingId,
    setSelectedOfferingId,
    offeringOptions,
    isOfferingsDisabled,
    selectedOrgId
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

  // Handle "NEXT" button click - now with actual Supabase saving
  const handleNextClick = async () => {
    if (!selectedOrgId) {
      toast({
        title: "Organization required",
        description: "Please select an organization first.",
        variant: "destructive",
      });
      return;
    }

    if (!offering.trim()) {
      toast({
        title: "Offering name required",
        description: "Please provide a name for your offering.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Handle creating a new offering
      if (selectedOfferingId === "new-offering") {
        const { data, error } = await supabase
          .from("b1offerings")
          .insert({
            offering_name: offering.trim(),
            offering_keysellingpoints: sellingPoints.trim() || null,
            offering_problemsolved: problemSolved.trim() || null,
            offering_uniqueadvantages: uniqueOffering.trim() || null,
            organization_id: selectedOrgId,
            // Default values required by the schema
            offering_objective: "Sales", // Default value
            offering_specialcategory: "None" // Default value
          })
          .select('offering_id')
          .single();
        
        if (error) {
          throw error;
        }
        
        // Update the selected offering to the newly created one
        if (data) {
          setSelectedOfferingId(data.offering_id);
        }
        
        toast({
          title: "Offering created",
          description: "Your new offering has been created successfully."
        });
      } 
      // Handle updating an existing offering
      else if (selectedOfferingId && selectedOfferingId !== "new-offering") {
        const { error } = await supabase
          .from("b1offerings")
          .update({
            offering_name: offering.trim(),
            offering_keysellingpoints: sellingPoints.trim() || null,
            offering_problemsolved: problemSolved.trim() || null,
            offering_uniqueadvantages: uniqueOffering.trim() || null
          })
          .eq("offering_id", selectedOfferingId);
        
        if (error) {
          throw error;
        }
        
        // Refetch to ensure we have the latest data
        refetchOfferingDetails();
        
        toast({
          title: "Offering updated",
          description: "Your offering has been updated successfully."
        });
      }
      
      // Collapse this section and expand the next one
      // You might want to implement actual logic for this
    } catch (error: any) {
      console.error("Error saving offering:", error);
      
      toast({
        title: "Error saving offering",
        description: error.message || "There was an error saving your offering. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedOfferingId,
    offeringOptions,
    isOfferingsDisabled,
    offeringDetails,
    offeringInputRef,
    handleOfferingChange,
    handleNextClick,
    isSaving
  };
};
