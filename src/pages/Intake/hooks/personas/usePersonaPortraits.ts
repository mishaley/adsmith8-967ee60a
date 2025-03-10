
import { useCallback } from "react";
import { Persona } from "../../components/Personas/types";
import { getRandomRace, savePortraitsToSession } from "../../components/Personas/utils/portraitUtils";
import { logInfo } from "@/utils/logging";

export const usePersonaPortraits = (
  personas: Persona[],
  retryPortraitGenerationBase: (persona: Persona, index: number, updatePersonaCallback: (index: number, updatedPersona: Persona) => void, customPrompt?: string) => Promise<void>,
  updatePersona: (index: number, updatedPersona: Persona) => void
) => {
  // Generate portraits for all personas - simplified implementation
  const generatePortraitsForAll = useCallback(
    async (
      personasList: Persona[],
      generatePortraitsFunction: (personasList: Persona[], updatePersonaCallback: (index: number, updatedPersona: Persona) => void, customPrompt?: string) => Promise<void>,
      customPrompt?: string
    ) => {
      if (!personasList || personasList.length === 0) {
        return;
      }

      // Portrait generation is intentionally disabled
      logInfo("Automatic portrait generation is disabled");
    },
    [updatePersona]
  );

  // Retry portrait generation for a specific persona - simplified implementation
  const retryPortraitGeneration = useCallback(
    (index: number, customPrompt?: string) => {
      if (!personas || !personas[index]) {
        return;
      }
      
      // Portrait regeneration is intentionally disabled
      logInfo("Portrait regeneration is disabled");
    },
    [personas, retryPortraitGenerationBase, updatePersona]
  );

  return {
    generatePortraitsForAll,
    retryPortraitGeneration,
  };
};
