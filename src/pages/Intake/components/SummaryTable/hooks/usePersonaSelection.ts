
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logDebug, logError, logInfo } from "@/utils/logging";
import { loadFromLocalStorage, saveToLocalStorage } from "../../../utils/localStorage/core";

export const usePersonaSelection = (
  selectedOfferingId: string
) => {
  // Multi-select state for personas
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>(() => {
    // Attempt to load from localStorage on initialization
    return loadFromLocalStorage<string[]>(`persona_selectedIds_${selectedOfferingId}`, []);
  });
  
  // Reset persona selection when offering changes
  useEffect(() => {
    logDebug("Offering changed to: " + selectedOfferingId, 'ui');
    // When offering changes or is cleared, reset personas
    setSelectedPersonaIds([]);
  }, [selectedOfferingId]);

  // Persist selection to localStorage when it changes
  useEffect(() => {
    if (selectedOfferingId) {
      saveToLocalStorage(`persona_selectedIds_${selectedOfferingId}`, selectedPersonaIds);
    }
  }, [selectedPersonaIds, selectedOfferingId]);

  // Query personas based on selected offering
  const { 
    data: personas = [], 
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ["personas", selectedOfferingId],
    queryFn: async () => {
      if (!selectedOfferingId || selectedOfferingId === "new-offering") {
        return [];
      }
      
      logInfo(`Fetching personas for offering ID: ${selectedOfferingId}`, 'api');
      
      const { data, error } = await supabase
        .from("c1personas")
        .select("persona_id, persona_name")
        .eq("offering_id", selectedOfferingId);
      
      if (error) {
        logError("Error fetching personas:", 'api', error);
        throw error;
      }
      
      logInfo(`Fetched ${data?.length || 0} personas for offering ID: ${selectedOfferingId}`, 'api');
      return data || [];
    },
    enabled: !!selectedOfferingId && selectedOfferingId !== "new-offering",
    staleTime: 60000, // Cache for 1 minute
    retry: 2,
  });

  // Refetch personas when offering changes
  useEffect(() => {
    if (selectedOfferingId && selectedOfferingId !== "new-offering") {
      refetch();
    }
  }, [selectedOfferingId, refetch]);

  // Format options for the select component
  const personaOptions = personas.map(persona => ({
    value: persona.persona_id,
    label: persona.persona_name
  }));

  // Determine disabled state - only disabled if no offering is selected or it's "new-offering"
  const isPersonasDisabled = !selectedOfferingId || selectedOfferingId === "new-offering";

  // Log for debug purposes
  useEffect(() => {
    logDebug(`Persona selection state:`, 'ui');
    logDebug(`- Selected offering ID: ${selectedOfferingId}`, 'ui');
    logDebug(`- Personas disabled: ${isPersonasDisabled}`, 'ui');
    logDebug(`- Loading: ${isLoading}`, 'ui');
    logDebug(`- Error: ${isError}`, 'ui');
    logDebug(`- Number of personas available: ${personas.length}`, 'ui');
  }, [selectedOfferingId, isPersonasDisabled, isLoading, isError, personas.length]);

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
    isError,
    error,
    refetch
  };
};
