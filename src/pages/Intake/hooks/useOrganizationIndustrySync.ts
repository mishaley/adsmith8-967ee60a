
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useOrganizationIndustrySync = (
  selectedOrgId: string,
  industry: string,
  setIndustry: (value: string) => void
) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Update industry in Supabase when it changes locally
  const updateIndustryInSupabase = async (newIndustry: string) => {
    // Skip if no organization is selected or it's a new organization
    if (!selectedOrgId || selectedOrgId === "new-organization") {
      return;
    }
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("a1organizations")
        .update({ organization_industry: newIndustry })
        .eq("organization_id", selectedOrgId);
      
      if (error) {
        console.error("Error updating industry:", error);
        toast({
          title: "Error updating industry",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Industry updated successfully in Supabase");
      }
    } catch (error) {
      console.error("Unexpected error updating industry:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Debounced industry update
  useEffect(() => {
    if (!isUpdating && selectedOrgId && selectedOrgId !== "new-organization" && industry) {
      const timer = setTimeout(() => {
        updateIndustryInSupabase(industry);
      }, 500); // 500ms debounce
      
      return () => clearTimeout(timer);
    }
  }, [industry, selectedOrgId, isUpdating]);
  
  return {
    isUpdating,
  };
};
