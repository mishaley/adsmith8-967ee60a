
import { useState, useEffect, useCallback } from "react";
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
      logInfo(`Initial offering ID from localStorage: ${storedValue || "none"}`);
      return storedValue || "";
    } catch (error) {
      logError(`Error initializing from localStorage (${OFFERING_STORAGE_KEY}):`, error);
      return "";
    }
  });

  // Query offerings based on selected organization
  const { data: offerings = [], isLoading, error, refetch } = useQuery({
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

  // Save offering selection to localStorage whenever it changes
  useEffect(() => {
    try {
      if (selectedOfferingId) {
        logInfo(`Saving offering ID to localStorage: ${selectedOfferingId}`);
        localStorage.setItem(OFFERING_STORAGE_KEY, selectedOfferingId);
      } else {
        logInfo("Removing offering ID from localStorage");
        localStorage.removeItem(OFFERING_STORAGE_KEY);
      }
    } catch (error) {
      logError("Error saving offering ID to localStorage:", error);
    }
  }, [selectedOfferingId, OFFERING_STORAGE_KEY]);

  // Validate the stored offering selection when organization or offerings change
  useEffect(() => {
    const validateStoredOffering = async () => {
      if (!selectedOrgId) {
        // If no organization is selected, clear offering selection
        if (selectedOfferingId) {
          logInfo("Clearing offering selection as organization was cleared");
          setSelectedOfferingId("");
        }
        return;
      }

      // Check if we have a stored offering ID but no current selection
      try {
        const storedOffering = localStorage.getItem(OFFERING_STORAGE_KEY);
        
        if (storedOffering && !selectedOfferingId) {
          logInfo(`Found stored offering ID: ${storedOffering}, checking if valid for current org`);
          
          // Check if this offering belongs to the current organization
          if (offerings.length > 0) {
            // Check if the stored offering exists in the offerings list
            const isValidOffering = storedOffering === "new-offering" || 
                                   offerings.some(o => o.offering_id === storedOffering);
            
            if (isValidOffering) {
              logInfo(`Restoring valid stored offering: ${storedOffering}`);
              setSelectedOfferingId(storedOffering);
            } else {
              logInfo(`Stored offering ${storedOffering} not valid for current org, clearing`);
              localStorage.removeItem(OFFERING_STORAGE_KEY);
            }
          } else if (offerings.length === 0 && isLoading) {
            // Offerings are still loading, wait for them
            logDebug("Offerings still loading, will validate stored selection when loaded");
          } else {
            // No offerings found for this org, but stored value is "new-offering"
            if (storedOffering === "new-offering") {
              logInfo("Restoring 'new-offering' selection");
              setSelectedOfferingId("new-offering");
            } else {
              logInfo("No offerings found for this org, clearing stored offering");
              localStorage.removeItem(OFFERING_STORAGE_KEY);
            }
          }
        }
      } catch (error) {
        logError("Error validating stored offering:", error);
      }
    };

    validateStoredOffering();
  }, [selectedOrgId, offerings, selectedOfferingId, isLoading, OFFERING_STORAGE_KEY]);

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
    } else {
      // Organization changed - refetch offerings
      refetch();
    }
  }, [selectedOrgId, selectedOfferingId, OFFERING_STORAGE_KEY, refetch]);

  // Listen for clear form event
  useEffect(() => {
    const handleClearForm = () => {
      logInfo("Clear form event detected in useOfferingData");
      setSelectedOfferingId("");
      localStorage.removeItem(OFFERING_STORAGE_KEY);
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => {
      window.removeEventListener('clearForm', handleClearForm);
    };
  }, [OFFERING_STORAGE_KEY]);

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

  // The dropdown should be disabled when no organization is selected
  const isOfferingsDisabled = !selectedOrgId;

  const setSelectedOfferingWithStorage = useCallback((value: string) => {
    logInfo(`Setting offering ID to: ${value || "none"}`);
    setSelectedOfferingId(value);
    
    try {
      if (value) {
        localStorage.setItem(OFFERING_STORAGE_KEY, value);
      } else {
        localStorage.removeItem(OFFERING_STORAGE_KEY);
      }
    } catch (error) {
      logError("Error updating offering ID in localStorage:", error);
    }
  }, [OFFERING_STORAGE_KEY]);

  return {
    selectedOfferingId,
    setSelectedOfferingId: setSelectedOfferingWithStorage,
    offerings,
    offeringOptions,
    isOfferingsDisabled,
    isLoading,
    error
  };
};
