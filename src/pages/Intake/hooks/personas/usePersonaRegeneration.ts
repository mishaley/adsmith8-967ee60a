
import { useCallback } from "react";
import { Persona } from "../../components/Personas/types";
import { handlePortraitUpdateCallback, updateSessionWithPersonas } from "./utils/personaManagerUtils";

export const usePersonaRegeneration = (
  personas: Persona[],
  offering: string,
  selectedCountry: string,
  regenerateSinglePersona: (index: number, offering: string, selectedCountry: string) => Promise<Persona | null>,
  retryPortraitGeneration: (persona: Persona, index: number, callback: (index: number, updatedPersona: Persona) => void) => void,
  updatePersona: (index: number, updatedPersona: Persona | null) => void,
) => {
  // Regenerate a single persona and its portrait
  const regeneratePersona = useCallback(async (index: number) => {
    // First regenerate the persona
    const newPersona = await regenerateSinglePersona(index, offering, selectedCountry);
    
    if (newPersona) {
      // Then generate a portrait for it
      retryPortraitGeneration(newPersona, index, (idx, updatedPersona) => {
        handlePortraitUpdateCallback(idx, updatedPersona, personas, updatePersona);
      });
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
