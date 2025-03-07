
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
    personasList: Persona[],
    generatePortraitsForAllPersonas: (personasList: Persona[], updatePersonaCallback: (index: number, updatedPersona: Persona) => void) => void
  ) => {
    // Use the provided personasList instead of the personas from props
    if (!personasList || personasList.length === 0) {
      return;
    }
    
    generatePortraitsForAllPersonas(personasList, (index, updatedPersona) => {
      handlePortraitUpdateCallback(index, updatedPersona, personasList, updatePersona);
    });
  }, [updatePersona]);

  // Wrapper for retryPortraitGeneration
  const retryPortraitGeneration = useCallback((index: number) => {
    if (!personas[index]) {
      return;
    }
    
    retryPortraitBase(personas[index], index, (idx, updatedPersona) => {
      handlePortraitUpdateCallback(idx, updatedPersona, personas, updatePersona);
    });
  }, [personas, retryPortraitBase, updatePersona]);

  return {
    generatePortraitsForAll,
    retryPortraitGeneration
  };
};
