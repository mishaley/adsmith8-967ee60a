
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { logDebug, logError, logInfo, logWarning } from "@/utils/logging";

export const useOrganizationIndustrySync = (
  selectedOrgId: string,
  industry: string,
  setIndustry: (value: string) => void
) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const prevIndustryRef = useRef(industry);
  const prevOrgIdRef = useRef(selectedOrgId);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update industry in Supabase when it changes locally
  const updateIndustryInSupabase = async (newIndustry: string) => {
    // Skip if no organization is selected or it's a new organization
    if (!selectedOrgId || selectedOrgId === "new-organization") {
      return;
    }
    
    // For existing organizations, we now prevent database updates for safety
    // This function will mainly be used for new organizations
    
    // Validate UUID format to prevent invalid database queries
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selectedOrgId)) {
      logError(`Invalid organization ID format: ${selectedOrgId}`);
      return;
    }
    
    setIsUpdating(true);
    try {
      logInfo(`Updating industry to "${newIndustry}" for org ID: ${selectedOrgId}`);
      
      const { error } = await supabase
        .from("a1organizations")
        .update({ organization_industry: newIndustry })
        .eq("organization_id", selectedOrgId);
      
      if (error) {
        logError("Error updating industry:", error);
        toast({
          title: "Error updating industry",
          description: error.message,
          variant: "destructive",
        });
      } else {
        logDebug("Industry updated successfully in Supabase");
      }
    } catch (error) {
      logError("Unexpected error updating industry:", error);
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

      // Skip if org ID didn't actually change
      if (selectedOrgId === prevOrgIdRef.current) {
        return;
      }
      
      // Validate UUID format to prevent invalid database queries
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selectedOrgId)) {
        logError(`Invalid organization ID format: ${selectedOrgId}`);
        return;
      }

      prevOrgIdRef.current = selectedOrgId;
      
      try {
        logInfo(`Fetching industry data for org ID: ${selectedOrgId}`);
        
        const { data, error } = await supabase
          .from("a1organizations")
          .select("organization_industry")
          .eq("organization_id", selectedOrgId)
          .maybeSingle();
        
        if (error) {
          logError("Error fetching industry:", error);
          return;
        }
        
        if (data) {
          const fetchedIndustry = data.organization_industry || '';
          logDebug(`Fetched industry from Supabase: "${fetchedIndustry}"`);
          
          // Update local state without triggering the update effect
          prevIndustryRef.current = fetchedIndustry;
          setIndustry(fetchedIndustry);
        } else {
          logWarning(`No data found for organization ID: ${selectedOrgId}`);
          // Clear industry if no data is found
          prevIndustryRef.current = '';
          setIndustry('');
        }
      } catch (error) {
        logError("Unexpected error fetching industry:", error);
      }
    };

    fetchIndustry();
  }, [selectedOrgId, setIndustry]);
  
  // Properly debounced industry update - only for new organizations now
  useEffect(() => {
    // Skip if currently updating, no org is selected, or industry hasn't changed
    if (
      isUpdating || 
      !selectedOrgId || 
      selectedOrgId !== "new-organization" || // Only update for new organizations
      industry === prevIndustryRef.current
    ) {
      return;
    }
    
    // When org ID changes, don't update until we've fetched the current industry
    if (selectedOrgId !== prevOrgIdRef.current) {
      logDebug(`Organization changed, skipping industry update until data is fetched`);
      return;
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set up new timeout
    timeoutRef.current = setTimeout(() => {
      logDebug(`Debounced industry update triggered: "${industry}"`);
      prevIndustryRef.current = industry;
      updateIndustryInSupabase(industry);
      timeoutRef.current = null;
    }, 1000); // 1000ms debounce
    
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
