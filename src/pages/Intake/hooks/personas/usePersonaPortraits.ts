
import { Persona } from "../../components/Personas/types";
import { handlePortraitUpdateCallback } from "./utils/personaManagerUtils";

export const usePersonaPortraits = (
  personas: Persona[],
  retryPortraitBase: (persona: Persona, index: number, callback: (index: number, updatedPersona: Persona) => void) => void,
  updatePersona: (index: number, updatedPersona: Persona) => void
) => {
  // Wrapper for generating portraits for all personas
  const generatePortraitsForAll = (
    generatePortraitsForAllPersonas: (personasList: Persona[], updatePersonaCallback: (index: number, updatedPersona: Persona) => void) => void
  ) => {
    generatePortraitsForAllPersonas(personas, (index, updatedPersona) => {
      handlePortraitUpdateCallback(index, updatedPersona, personas, updatePersona);
    });
  };

  // Wrapper for retryPortraitGeneration
  const retryPortraitGeneration = (index: number) => {
    if (!personas[index]) return;
    
    retryPortraitBase(personas[index], index, (idx, updatedPersona) => {
      handlePortraitUpdateCallback(idx, updatedPersona, personas, updatePersona);
    });
  };

  return {
    generatePortraitsForAll,
    retryPortraitGeneration
  };
};
