
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_KEY, DEFAULT_ORG_ID } from "./constants";

export const useSummaryTableData = () => {
  // Initialize with the stored organization ID from localStorage
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    localStorage.getItem(STORAGE_KEY) || DEFAULT_ORG_ID
  );
  
  // Multi-select state (arrays instead of single string values)
  const [selectedOfferingIds, setSelectedOfferingIds] = useState<string[]>([]);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  // Watch for changes to the organization in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newOrgId = localStorage.getItem(STORAGE_KEY) || DEFAULT_ORG_ID;
      setSelectedOrgId(newOrgId);
    };

    // Set up event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name");
      
      if (error) throw error;
      return data || [];
    },
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

  // Query personas based on selected offerings
  const { data: personas = [] } = useQuery({
    queryKey: ["personas", selectedOfferingIds],
    queryFn: async () => {
      if (selectedOfferingIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("c1personas")
        .select("persona_id, persona_name")
        .in("offering_id", selectedOfferingIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: selectedOfferingIds.length > 0, // Only run query if offerings are selected
  });

  // Query messages based on selected personas
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selectedPersonaIds],
    queryFn: async () => {
      if (selectedPersonaIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("d1messages")
        .select("message_id, message_name")
        .in("persona_id", selectedPersonaIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: selectedPersonaIds.length > 0, // Only run query if personas are selected
  });

  // Reset offerings selection when organization changes
  useEffect(() => {
    setSelectedOfferingIds([]);
  }, [selectedOrgId]);

  // Reset persona selection when offerings change
  useEffect(() => {
    setSelectedPersonaIds([]);
  }, [selectedOfferingIds]);

  // Reset message selection when personas change
  useEffect(() => {
    setSelectedMessageIds([]);
  }, [selectedPersonaIds]);

  // Handle organization selection change
  const handleOrgChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedOrgId("");
      // Reset everything when organization is cleared
      setSelectedOfferingIds([]);
      setSelectedPersonaIds([]);
      setSelectedMessageIds([]);
    } else {
      setSelectedOrgId(value);
      // When organization changes in this component, update localStorage 
      // to keep it in sync with the Q1 selector
      localStorage.setItem(STORAGE_KEY, value);
      // Dispatch storage event for other components to sync
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Format options for the multi-select component
  const offeringOptions = offerings.map(offering => ({
    value: offering.offering_id,
    label: offering.offering_name
  }));

  const personaOptions = personas.map(persona => ({
    value: persona.persona_id,
    label: persona.persona_name
  }));

  const messageOptions = messages.map(message => ({
    value: message.message_id,
    label: message.message_name
  }));

  // Determine if offerings selection should be disabled
  const isOfferingsDisabled = !selectedOrgId || selectedOrgId === "";

  return {
    selectedOrgId,
    selectedOfferingIds,
    setSelectedOfferingIds,
    selectedPersonaIds,
    setSelectedPersonaIds,
    selectedMessageIds,
    setSelectedMessageIds,
    organizations,
    offeringOptions,
    personaOptions,
    messageOptions,
    handleOrgChange,
    isOfferingsDisabled
  };
};
