
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useOrganizationIndustrySync = (
  selectedOrgId: string,
  industry: string,
  setIndustry: (value: string) => void
) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const prevIndustryRef = useRef(industry);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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

  // Fetch industry from Supabase when selectedOrgId changes
  useEffect(() => {
    const fetchIndustry = async () => {
      if (!selectedOrgId || selectedOrgId === "new-organization") {
        return;
      }

      try {
        const { data, error } = await supabase
          .from("a1organizations")
          .select("organization_industry")
          .eq("organization_id", selectedOrgId)
          .single();
        
        if (error) {
          console.error("Error fetching industry:", error);
          return;
        }
        
        if (data && data.organization_industry) {
          console.log("Fetched industry from Supabase:", data.organization_industry);
          // Update local state without triggering the update effect
          prevIndustryRef.current = data.organization_industry;
          setIndustry(data.organization_industry);
        }
      } catch (error) {
        console.error("Unexpected error fetching industry:", error);
      }
    };

    fetchIndustry();
  }, [selectedOrgId, setIndustry]);
  
  // Properly debounced industry update
  useEffect(() => {
    // Skip if currently updating, no org is selected, or industry hasn't changed
    if (
      isUpdating || 
      !selectedOrgId || 
      selectedOrgId === "new-organization" || 
      !industry ||
      industry === prevIndustryRef.current
    ) {
      return;
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set up new timeout
    timeoutRef.current = setTimeout(() => {
      console.log("Debounced industry update triggered:", industry);
      prevIndustryRef.current = industry;
      updateIndustryInSupabase(industry);
      timeoutRef.current = null;
    }, 1000); // Increase to 1000ms to reduce flashing
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [industry, selectedOrgId, isUpdating]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return {
    isUpdating,
  };
};
