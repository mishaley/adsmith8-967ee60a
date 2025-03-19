
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logDebug, logError, logInfo } from "@/utils/logging";
import { loadFromLocalStorage, saveToLocalStorage, clearLocalStorageItem } from "../../../utils/localStorage/core";

export const usePersonaSelection = (
  selectedOfferingId: string
) => {
  console.log(selectedOfferingId);
  
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
    
    // Clear the localStorage entry for the previous offering's personas
    if (selectedOfferingId) {
      // We don't need to clear the current offering's storage,
      // just make sure the selection state is reset
      logDebug(`Reset persona selection for new offering: ${selectedOfferingId}`, 'ui');
    } else {
      // If no offering is selected, clear all persona selections
      clearLocalStorageItem(`persona_selectedIds_${selectedOfferingId}`);
      logDebug("Cleared persona selection as no offering is selected", 'ui');
    }
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
        .select("*")
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
console.log({personas});

  // Refetch personas when offering changes
  useEffect(() => {
    if (selectedOfferingId && selectedOfferingId !== "new-offering") {
      refetch();
      console.log('selectedOfferingId', selectedOfferingId);
      
    }
  }, [selectedOfferingId, refetch]);

  // Format options for the select component
  const personaOptions = personas.map(persona => ({
    value: persona.persona_id,
    label: persona.persona_name
  }));

  // Determine disabled state - only disabled if no offering is selected or it's "new-offering"
  const offerId = localStorage.getItem("adsmith_offering_selectedId")
  const isPersonasDisabled = !offerId || offerId === "new-offering";
  

  // Validate that selected persona IDs still exist in the current options
  useEffect(() => {
    if (!isLoading && personas.length > 0 && selectedPersonaIds.length > 0) {
      // Get all valid persona IDs from the current options
      const validPersonaIds = personas.map(persona => persona.persona_id);
      
      // Filter out any selected IDs that are no longer valid
      const validSelections = selectedPersonaIds.filter(id => 
        validPersonaIds.includes(id)
      );
      
      // If some selections were invalid, update the state
      if (validSelections.length !== selectedPersonaIds.length) {
        logDebug(`Removing ${selectedPersonaIds.length - validSelections.length} invalid persona selections`, 'ui');
        setSelectedPersonaIds(validSelections);
      }
    }
  }, [personas, selectedPersonaIds, isLoading]);

  // Log for debug purposes
  useEffect(() => {
    logDebug(`Persona selection state:`, 'ui');
    logDebug(`- Selected offering ID: ${selectedOfferingId}`, 'ui');
    logDebug(`- Personas disabled: ${isPersonasDisabled}`, 'ui');
    logDebug(`- Loading: ${isLoading}`, 'ui');
    logDebug(`- Error: ${isError}`, 'ui');
    logDebug(`- Number of personas available: ${personas.length}`, 'ui');
    logDebug(`- Selected persona IDs: ${JSON.stringify(selectedPersonaIds)}`, 'ui');
  }, [selectedOfferingId, isPersonasDisabled, isLoading, isError, personas.length, selectedPersonaIds]);

  if (error) {
    logError("Error in usePersonaSelection:", 'api', error);
  }

  // Clear selection handler for external components to use
  const clearSelection = useCallback(() => {
    setSelectedPersonaIds([]);
    if (selectedOfferingId) {
      clearLocalStorageItem(`persona_selectedIds_${selectedOfferingId}`);
    }
    logDebug("Manually cleared persona selection", 'ui');
  }, [selectedOfferingId]);

  return {
    selectedPersonaIds,
    setSelectedPersonaIds,
    personas,
    personaOptions,
    isPersonasDisabled,
    isLoading,
    isError,
    error,
    refetch,
    clearSelection
  };
};
