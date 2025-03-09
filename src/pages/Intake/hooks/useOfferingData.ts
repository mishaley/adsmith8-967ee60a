
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocalStorageWithEvents } from "./useLocalStorageWithEvents";
import { STORAGE_KEYS } from "../utils/localStorageUtils";

export const useOfferingData = (selectedOrgId: string) => {
  const OFFERING_STORAGE_KEY = `${STORAGE_KEYS.OFFERING}_selectedId`;

  // Initialize with localStorage and event integration
  const [selectedOfferingId, setSelectedOfferingId] = useLocalStorageWithEvents({
    key: OFFERING_STORAGE_KEY,
    initialValue: "",
    eventName: "offeringChanged",
    eventDetailKey: "offeringId"
  });

  // Query offerings based on selected organization
  const { data: offerings = [] } = useQuery({
    queryKey: ["offerings", selectedOrgId],
    queryFn: async () => {
      if (!selectedOrgId) return [];
      
      const { data, error } = await supabase
        .from("b1offerings")
        .select("offering_id, offering_name")
        .eq("organization_id", selectedOrgId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedOrgId, // Only run query if an organization is selected
  });

  // Reset offering selection when organization changes or when offerings data changes
  useEffect(() => {
    // When organization is empty or changes, check if current offering is valid
    if (offerings.length === 0) {
      // No offerings available - clear selection unless it's "new-offering"
      if (selectedOfferingId && selectedOfferingId !== "new-offering") {
        console.log("Clearing offering selection - no offerings available");
        setSelectedOfferingId("");
      }
    } else if (selectedOfferingId && selectedOfferingId !== "new-offering") {
      // Check if the selected offering still exists in the offerings list
      const offeringExists = offerings.some(o => o.offering_id === selectedOfferingId);
      if (!offeringExists) {
        console.log(`Clearing offering selection - offering ${selectedOfferingId} no longer exists`);
        setSelectedOfferingId("");
      }
    }
  }, [selectedOrgId, offerings, selectedOfferingId, setSelectedOfferingId]);

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

  // Determine disabled state
  const isOfferingsDisabled = !selectedOrgId;

  return {
    selectedOfferingId,
    setSelectedOfferingId,
    offerings,
    offeringOptions,
    isOfferingsDisabled
  };
};
