
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePersonaSelection = (
  selectedOfferingId: string, 
  isOfferingsDisabled: boolean
) => {
  // Multi-select state for personas
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  
  // Reset persona selection when offering changes
  useEffect(() => {
    console.log("Offering changed to:", selectedOfferingId);
    // When offering changes or is cleared, reset personas
    setSelectedPersonaIds([]);
  }, [selectedOfferingId]);

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

  // Format options for the select component
  const personaOptions = personas.map(persona => ({
    value: persona.persona_id,
    label: persona.persona_name
  }));

  // Determine disabled state
  const isPersonasDisabled = isOfferingsDisabled || !selectedOfferingId;

  return {
    selectedPersonaIds,
    setSelectedPersonaIds,
    personas,
    personaOptions,
    isPersonasDisabled
  };
};
