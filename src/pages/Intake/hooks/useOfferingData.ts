
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_KEYS } from "../utils/localStorage";
import { logDebug, logInfo, logError } from "@/utils/logging";

export const useOfferingData = (selectedOrgId: string) => {
  // Storage key for offering
  const STORAGE_KEY = `${STORAGE_KEYS.OFFERING}_selectedId`;
  
  // Initialize with localStorage
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>(() => {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      logDebug(`Initial offering ID from localStorage: ${storedValue || "none"}`);
      return storedValue || "";
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return "";
    }
  });

  // Effect to reset offering when org changes or clears
  useEffect(() => {
    if (!selectedOrgId) {
      // Clear offering when org is cleared
      if (selectedOfferingId) {
        logInfo("Clearing offering selection as organization was cleared");
        setSelectedOfferingId("");
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [selectedOrgId, selectedOfferingId]);

  // Query offerings based on selected organization
  const { data: offerings = [], isLoading: isOfferingsLoading } = useQuery({
    queryKey: ["offerings", selectedOrgId],
    queryFn: async () => {
      if (!selectedOrgId || selectedOrgId === "new-organization") return [];
      
      logInfo(`Fetching offerings for org ID: ${selectedOrgId}`);
      const { data, error } = await supabase
        .from("a1offerings")
        .select("offering_id, offering_name")
        .eq("organization_id", selectedOrgId);
      
      if (error) throw error;
      logInfo(`Fetched ${data?.length || 0} offerings`);
      return data || [];
    },
    enabled: !!selectedOrgId && selectedOrgId !== "new-organization",
  });

  // Transform offerings data into select options
  const offeringOptions = offerings.map(offering => ({
    value: offering.offering_id,
    label: offering.offering_name
  }));

  // Determine if offerings dropdown should be disabled
  const isOfferingsDisabled = !selectedOrgId || selectedOrgId === "new-organization";

  // Listen for form clearing
  useEffect(() => {
    const handleClearForm = () => {
      logInfo("Clear form event detected in useOfferingData");
      setSelectedOfferingId("");
      localStorage.removeItem(STORAGE_KEY);
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => {
      window.removeEventListener('clearForm', handleClearForm);
    };
  }, []);

  // Update localStorage when offering changes
  useEffect(() => {
    try {
      if (selectedOfferingId) {
        localStorage.setItem(STORAGE_KEY, selectedOfferingId);
        logDebug(`Saved offering ID to localStorage: ${selectedOfferingId}`);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        logDebug("Removed offering ID from localStorage");
      }
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [selectedOfferingId]);

  return {
    selectedOfferingId,
    setSelectedOfferingId,
    offerings,
    offeringOptions,
    isOfferingsDisabled,
    isOfferingsLoading
  };
};
