
import { useCallback } from "react";
import { Persona } from "../../components/Personas/types";
import { updateSessionWithPersonas } from "./utils/personaManagerUtils";
import { logInfo } from "@/utils/logging";

export const usePersonaRegeneration = (
  personas: Persona[],
  offering: string,
  selectedCountry: string,
  regenerateSinglePersona: (index: number, offering: string, selectedCountry: string) => Promise<Persona | null>,
  retryPortraitGeneration: (persona: Persona, index: number, callback: (index: number, updatedPersona: Persona) => void) => void,
  updatePersona: (index: number, updatedPersona: Persona | null) => void,
) => {
  // Regenerate a single persona and its portrait - simplified implementation
  const regeneratePersona = useCallback(async (index: number) => {
    // First regenerate the persona
    const newPersona = await regenerateSinglePersona(index, offering, selectedCountry);
    
    if (newPersona) {
      // Portrait generation is disabled, so just log and return
      logInfo(`Persona ${index} regenerated, but portrait generation is disabled`);
    }
  }, [personas, offering, selectedCountry, regenerateSinglePersona, retryPortraitGeneration, updatePersona]);

  // Remove a persona and immediately generate a new one
  const removePersona = useCallback((index: number) => {
    if (!personas[index]) return;
    
    // Create a copy of the personas array
    const updatedPersonas = [...personas];
    // Remove the persona at the specified index
    updatedPersonas[index] = null;
    // Update each persona with the null value
    updatePersona(index, null);
    
    // Save updated personas to session
    updateSessionWithPersonas(personas, index, null);
    
    // Immediately regenerate a new persona for this slot
    regeneratePersona(index);
  }, [personas, updatePersona, regeneratePersona]);

  return {
    regeneratePersona,
    removePersona
  };
};
