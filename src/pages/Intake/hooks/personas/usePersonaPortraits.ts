
import { useCallback } from "react";
import { Persona } from "../../components/Personas/types";
import { handlePortraitUpdateCallback } from "./utils/personaManagerUtils";

export const usePersonaPortraits = (
  personas: Persona[],
  retryPortraitBase: (persona: Persona, index: number, callback: (index: number, updatedPersona: Persona) => void) => void,
  updatePersona: (index: number, updatedPersona: Persona) => void
) => {
  // Wrapper for generating portraits for all personas
  const generatePortraitsForAll = useCallback((
    generatePortraitsForAllPersonas: (personasList: Persona[], updatePersonaCallback: (index: number, updatedPersona: Persona) => void) => void
  ) => {
    console.log("generatePortraitsForAll called with personas:", personas);
    if (!personas || personas.length === 0) {
      console.warn("No personas to generate portraits for");
      return;
    }
    
    generatePortraitsForAllPersonas(personas, (index, updatedPersona) => {
      console.log(`Portrait generated for persona ${index + 1}, updating state`);
      handlePortraitUpdateCallback(index, updatedPersona, personas, updatePersona);
    });
  }, [personas, updatePersona]);

  // Wrapper for retryPortraitGeneration
  const retryPortraitGeneration = useCallback((index: number) => {
    if (!personas[index]) {
      console.warn(`Cannot retry portrait for persona ${index + 1} - persona not found`);
      return;
    }
    
    console.log(`Manually retrying portrait for persona ${index + 1}`);
    retryPortraitBase(personas[index], index, (idx, updatedPersona) => {
      handlePortraitUpdateCallback(idx, updatedPersona, personas, updatePersona);
    });
  }, [personas, retryPortraitBase, updatePersona]);

  return {
    generatePortraitsForAll,
    retryPortraitGeneration
  };
};
