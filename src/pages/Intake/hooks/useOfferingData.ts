
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_KEYS } from "../utils/localStorage";
import { logDebug, logInfo, logError } from "@/utils/logging";
import { dispatchDedupedEvent } from "@/utils/eventUtils";
import { clearPersonaDataForOffering } from "../utils/localStorage/formClear";

export const useOfferingData = (selectedOrgId: string) => {
  const STORAGE_KEY = `${STORAGE_KEYS.OFFERING}_selectedId`;
  
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>(() => {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      logDebug(`Initial offering ID from localStorage: ${storedValue || "none"}`, 'localStorage');
      return storedValue || "";
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return "";
    }
  });

  const [previousOfferingId, setPreviousOfferingId] = useState<string>(selectedOfferingId);
  const [offerings, setOfferings] = useState<any[]>([]);
  const [isOfferingsLoading, setIsOfferingsLoading] = useState(false);

  // Fetch initial data and set up real-time subscription
  useEffect(() => {
    if (!selectedOrgId || selectedOrgId === "new-organization") {
      setOfferings([]);
      return;
    }

    // Initial fetch
    const fetchOfferings = async () => {
      setIsOfferingsLoading(true);
      try {
        logInfo(`Fetching offerings for org ID: ${selectedOrgId}`, 'api');
        const { data, error } = await supabase
          .from("b1offerings")
          .select("offering_id, offering_name")
          .eq("organization_id", selectedOrgId);

        if (error) throw error;
        setOfferings(data || []);
        logInfo(`Fetched ${data?.length || 0} offerings`, 'api');
      } catch (error) {
        logError("Error fetching offerings:", 'api', error);
      } finally {
        setIsOfferingsLoading(false);
      }
    };

    fetchOfferings();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`offerings:${selectedOrgId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'b1offerings',
          filter: `organization_id=eq.${selectedOrgId}`
        },
        (payload) => {
          logDebug(`Realtime update received: ${payload.eventType}`, 'realtime');
          
          switch (payload.eventType) {
            case 'INSERT':
              setOfferings((current) => [...current, payload.new]);
              break;
            case 'UPDATE':
              setOfferings((current) =>
                current.map((offering) =>
                  offering.offering_id === payload.new.offering_id ? payload.new : offering
                )
              );
              break;
            case 'DELETE':
              setOfferings((current) =>
                current.filter((offering) => offering.offering_id !== payload.old.offering_id)
              );
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedOrgId]);

  // Clear offering when org changes or clears
  useEffect(() => {
    if (!selectedOrgId && selectedOfferingId) {
      logInfo("Clearing offering selection as organization was cleared", 'localStorage');
      setSelectedOfferingId("");
      localStorage.removeItem(STORAGE_KEY);
      
      // Dispatch event to notify other components
      dispatchDedupedEvent("offeringChanged", { offeringId: "" });
    }
  }, [selectedOrgId, selectedOfferingId]);

  // Handle clean up of personas when offering changes
  useEffect(() => {
    // If offering has changed
    if (selectedOfferingId !== previousOfferingId) {
      // Store the current offering as the previous one for next change
      setPreviousOfferingId(selectedOfferingId);
      
      // Only dispatch event when there's a real change, not on initial load
      if (previousOfferingId) {
        logInfo(`Offering changed from ${previousOfferingId} to ${selectedOfferingId}`, 'localStorage');
        
        // Dispatch event for the new offering (this is also handled elsewhere but we ensure it's sent)
        dispatchDedupedEvent("offeringChanged", { offeringId: selectedOfferingId });
        
        // Clean up persona data for the previous offering
        if (previousOfferingId) {
          clearPersonaDataForOffering(previousOfferingId);
        }
      }
    }
  }, [selectedOfferingId, previousOfferingId]);

  // Transform offerings data into select options
  const offeringOptions = offerings.map(offering => ({
    value: offering.offering_id,
    label: offering.offering_name
  }));

  const isOfferingsDisabled = !selectedOrgId || selectedOrgId === "new-organization";

  // Handle form clearing
  useEffect(() => {
    const handleClearForm = () => {
      logDebug("Clear form event detected in useOfferingData", 'localStorage');
      setSelectedOfferingId("");
      localStorage.removeItem(STORAGE_KEY);
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => window.removeEventListener('clearForm', handleClearForm);
  }, []);

  // Update localStorage when offering changes
  useEffect(() => {
    try {
      if (selectedOfferingId) {
        localStorage.setItem(STORAGE_KEY, selectedOfferingId);
        logDebug(`Saved offering ID to localStorage: ${selectedOfferingId}`, 'localStorage');
      } else {
        localStorage.removeItem(STORAGE_KEY);
        logDebug("Removed offering ID from localStorage", 'localStorage');
      }
    } catch (e) {
      logError("Error saving to localStorage:", 'localStorage', e);
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
