
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logDebug, logError } from "@/utils/logging";

export const usePersonaSelection = (
  selectedOfferingId: string, 
  isOfferingsDisabled: boolean
) => {
  // Multi-select state for personas
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  
  // Reset persona selection when offering changes
  useEffect(() => {
    logDebug("Offering changed to: " + selectedOfferingId, 'ui');
    // When offering changes or is cleared, reset personas
    setSelectedPersonaIds([]);
  }, [selectedOfferingId]);

  // Query personas based on selected offering
  const { 
    data: personas = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["personas", selectedOfferingId],
    queryFn: async () => {
      if (!selectedOfferingId) return [];
      
      logDebug(`Fetching personas for offering ID: ${selectedOfferingId}`, 'ui');
      
      const { data, error } = await supabase
        .from("c1personas")
        .select("persona_id, persona_name")
        .eq("offering_id", selectedOfferingId);
      
      if (error) {
        logError("Error fetching personas:", 'api', error);
        throw error;
      }
      
      logDebug(`Fetched ${data?.length || 0} personas for offering ID: ${selectedOfferingId}`, 'ui');
      return data || [];
    },
    enabled: !!selectedOfferingId, // Only run query if offering is selected
  });

  // Refetch personas when offering changes
  useEffect(() => {
    if (selectedOfferingId) {
      refetch();
    }
  }, [selectedOfferingId, refetch]);

  // Format options for the select component
  const personaOptions = personas.map(persona => ({
    value: persona.persona_id,
    label: persona.persona_name
  }));

  // Log options for debugging
  useEffect(() => {
    logDebug(`Persona options available: ${personaOptions.length}`, 'ui');
    if (personaOptions.length > 0) {
      logDebug(`First persona option: ${JSON.stringify(personaOptions[0])}`, 'ui');
    }
  }, [personaOptions]);

  // Determine disabled state
  const isPersonasDisabled = isOfferingsDisabled || !selectedOfferingId;

  if (error) {
    logError("Error in usePersonaSelection:", 'api', error);
  }

  return {
    selectedPersonaIds,
    setSelectedPersonaIds,
    personas,
    personaOptions,
    isPersonasDisabled,
    isLoading,
    error
  };
};
