
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOfferingSelection = (selectedOrgId: string) => {
  // Single select for offering instead of multi-select
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>("");
  
  // Reset offering selection when organization changes
  useEffect(() => {
    // When organization is empty or changes, clear offering selection
    setSelectedOfferingId("");
  }, [selectedOrgId]);

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

  // Format options for the select component
  const offeringOptions = offerings.map(offering => ({
    value: offering.offering_id,
    label: offering.offering_name
  }));

  // Determine disabled state - offerings are disabled when no organization is selected
  const isOfferingsDisabled = !selectedOrgId;

  return {
    selectedOfferingId,
    setSelectedOfferingId,
    offerings,
    offeringOptions,
    isOfferingsDisabled
  };
};
