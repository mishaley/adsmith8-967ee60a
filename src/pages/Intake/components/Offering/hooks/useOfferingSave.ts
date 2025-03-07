
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseOfferingSaveProps {
  selectedOrgId: string;
  selectedOfferingId: string;
  setSelectedOfferingId: (value: string) => void;
  offering: string;
  sellingPoints: string;
  problemSolved: string;
  uniqueOffering: string;
  refetchOfferingDetails: () => void;
}

export const useOfferingSave = ({
  selectedOrgId,
  selectedOfferingId,
  setSelectedOfferingId,
  offering,
  sellingPoints,
  problemSolved,
  uniqueOffering,
  refetchOfferingDetails
}: UseOfferingSaveProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

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
    isSaving,
    handleNextClick
  };
};
