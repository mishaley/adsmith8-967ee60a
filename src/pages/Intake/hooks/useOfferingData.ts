
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_KEYS } from "../utils/localStorage";
import { logDebug, logError, logInfo } from "@/utils/logging";

export const useOfferingData = (selectedOrgId: string) => {
  const OFFERING_STORAGE_KEY = `${STORAGE_KEYS.OFFERING}_selectedId`;

  // Initialize with localStorage
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>(() => {
    try {
      const storedValue = localStorage.getItem(OFFERING_STORAGE_KEY);
      return storedValue || "";
    } catch (error) {
      logError(`Error initializing from localStorage (${OFFERING_STORAGE_KEY}):`, error);
      return "";
    }
  });

  // Query offerings based on selected organization
  const { data: offerings = [], isLoading, error } = useQuery({
    queryKey: ["offerings", selectedOrgId],
    queryFn: async () => {
      if (!selectedOrgId) {
        logDebug("No organization selected, returning empty offerings array");
        return [];
      }
      
      logDebug(`Fetching offerings for organization: ${selectedOrgId}`);
      
      const { data, error } = await supabase
        .from("b1offerings")
        .select("offering_id, offering_name")
        .eq("organization_id", selectedOrgId);
      
      if (error) {
        logError(`Error fetching offerings for org ${selectedOrgId}:`, error);
        throw error;
      }
      
      logDebug(`Retrieved ${data?.length || 0} offerings for organization ${selectedOrgId}`);
      return data || [];
    },
    enabled: !!selectedOrgId, // Only run query if an organization is selected
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Handle organization changes
  useEffect(() => {
    logDebug(`Organization ID changed to: ${selectedOrgId || "none"}`);
    
    if (!selectedOrgId) {
      // Organization selection cleared - clear offering selection
      if (selectedOfferingId) {
        logInfo("Clearing offering selection as organization was cleared");
        setSelectedOfferingId("");
        localStorage.removeItem(OFFERING_STORAGE_KEY);
      }
    }
  }, [selectedOrgId, selectedOfferingId, OFFERING_STORAGE_KEY]);

  // Validate offering selection when offerings data changes
  useEffect(() => {
    if (!selectedOrgId || offerings.length === 0) return;
    
    logDebug(`Validating offering selection against ${offerings.length} offerings`);
    
    if (selectedOfferingId && selectedOfferingId !== "new-offering") {
      // Check if the selected offering still exists in the offerings list
      const offeringExists = offerings.some(o => o.offering_id === selectedOfferingId);
      if (!offeringExists) {
        logInfo(`Clearing offering selection - offering ${selectedOfferingId} no longer exists for this organization`);
        setSelectedOfferingId("");
        localStorage.removeItem(OFFERING_STORAGE_KEY);
      }
    }
  }, [offerings, selectedOfferingId, selectedOrgId, OFFERING_STORAGE_KEY]);

  // Update localStorage when offering selection changes
  useEffect(() => {
    try {
      if (selectedOfferingId) {
        localStorage.setItem(OFFERING_STORAGE_KEY, selectedOfferingId);
        logDebug(`Saved offering ID to localStorage: ${selectedOfferingId}`);
      } else {
        localStorage.removeItem(OFFERING_STORAGE_KEY);
        logDebug("Removed offering ID from localStorage");
      }
    } catch (error) {
      logError("Error saving offering ID to localStorage:", error);
    }
  }, [selectedOfferingId, OFFERING_STORAGE_KEY]);

  // Listen for clear form event
  useEffect(() => {
    const handleClearForm = () => {
      logInfo("Clear form event detected in useOfferingData");
      setSelectedOfferingId("");
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => {
      window.removeEventListener('clearForm', handleClearForm);
    };
  }, []);

  // Format options for the select component
  const offeringOptions = offerings.map(offering => ({
    value: offering.offering_id,
    label: offering.offering_name
  }));

  // Add 'Create new offering' option if an organization is selected
  if (selectedOrgId) {
    offeringOptions.push({
      value: "new-offering",
      label: "Create new offering"
    });
  }

  // The dropdown should NOT be disabled if an organization is selected
  const isOfferingsDisabled = !selectedOrgId;

  return {
    selectedOfferingId,
    setSelectedOfferingId,
    offerings,
    offeringOptions,
    isOfferingsDisabled,
    isLoading,
    error
  };
};
