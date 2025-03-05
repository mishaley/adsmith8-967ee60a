
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_KEY, DEFAULT_ORG_ID } from "./constants";

export const useSummaryTableData = () => {
  // Initialize with the stored organization ID from localStorage or empty string
  const [selectedOrgId, setSelectedOrgId] = useState<string>(() => {
    const storedOrgId = localStorage.getItem(STORAGE_KEY);
    return storedOrgId || "";
  });
  
  // Single select for offering instead of multi-select
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>("");
  
  // Multi-select state (arrays instead of single string values)
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  // Watch for changes to the organization in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newOrgId = localStorage.getItem(STORAGE_KEY) || "";
      if (newOrgId !== selectedOrgId) {
        setSelectedOrgId(newOrgId);
      }
    };

    // Set up event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [selectedOrgId]);

  // Reset dependent selections when organization changes
  useEffect(() => {
    console.log("Organization changed to:", selectedOrgId);
    // When organization is empty or changes, clear offering selection
    setSelectedOfferingId("");
  }, [selectedOrgId]);

  // Reset persona selection when offering changes
  useEffect(() => {
    console.log("Offering changed to:", selectedOfferingId);
    // When offering changes or is cleared, reset personas
    setSelectedPersonaIds([]);
  }, [selectedOfferingId]);

  // Reset message selection when personas change
  useEffect(() => {
    console.log("Personas changed to:", selectedPersonaIds);
    // When personas change or are cleared, reset messages
    setSelectedMessageIds([]);
  }, [selectedPersonaIds]);

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

  // Query personas based on selected offering
  const { data: personas = [] } = useQuery({
    queryKey: ["personas", selectedOfferingId],
    queryFn: async () => {
      if (!selectedOfferingId) return [];
      
      const { data, error } = await supabase
        .from("c1personas")
        .select("persona_id, persona_name")
        .eq("offering_id", selectedOfferingId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedOfferingId, // Only run query if offering is selected
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

  // Handle organization selection change
  const handleOrgChange = (value: string) => {
    console.log("Organization selection changed to:", value);
    
    // Update local state
    setSelectedOrgId(value);
    
    // Update localStorage
    if (value) {
      localStorage.setItem(STORAGE_KEY, value);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    
    // Trigger storage event for other components to sync
    window.dispatchEvent(new Event('storage'));
  };

  // Format options for the select component
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

  // Determine disabled states
  const isOfferingsDisabled = !selectedOrgId;
  const isPersonasDisabled = isOfferingsDisabled || !selectedOfferingId;
  const isMessagesDisabled = isPersonasDisabled || selectedPersonaIds.length === 0;

  return {
    selectedOrgId,
    selectedOfferingId,
    setSelectedOfferingId,
    selectedPersonaIds,
    setSelectedPersonaIds,
    selectedMessageIds,
    setSelectedMessageIds,
    organizations,
    offeringOptions,
    personaOptions,
    messageOptions,
    handleOrgChange,
    isOfferingsDisabled,
    isPersonasDisabled,
    isMessagesDisabled
  };
};
