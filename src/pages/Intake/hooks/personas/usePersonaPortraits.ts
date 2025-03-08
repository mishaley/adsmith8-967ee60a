
import { useCallback } from "react";
import { Persona } from "../../components/Personas/types";
import { generatePersonaPortrait } from "../../components/Personas/services/portraitService";
import { getRandomRace, savePortraitsToSession } from "../../components/Personas/utils/portraitUtils";

export const usePersonaPortraits = (
  personas: Persona[],
  retryPortraitGenerationBase: (persona: Persona, index: number, updatePersonaCallback: (index: number, updatedPersona: Persona) => void) => Promise<void>,
  updatePersona: (index: number, updatedPersona: Persona) => void
) => {
  // Generate portraits for all personas
  const generatePortraitsForAll = useCallback(
    async (
      personasList: Persona[],
      generatePortraitsFunction: (personasList: Persona[], updatePersonaCallback: (index: number, updatedPersona: Persona) => void) => Promise<void>,
      customPrompt?: string
    ) => {
      if (!personasList || personasList.length === 0) {
        return;
      }

      // Assign random races if not present
      const enhancedPersonas = personasList.map(persona => {
        if (!persona.race) {
          return { ...persona, race: getRandomRace() };
        }
        return persona;
      });

      // Update personas with races
      enhancedPersonas.forEach((persona, index) => {
        updatePersona(index, persona);
      });

      // Generate portraits
      await generatePortraitsFunction(enhancedPersonas, updatePersona, customPrompt);

      // Save to session
      savePortraitsToSession(enhancedPersonas);
    },
    [updatePersona]
  );

  // Retry portrait generation for a specific persona
  const retryPortraitGeneration = useCallback(
    (index: number, customPrompt?: string) => {
      if (!personas || !personas[index]) {
        return;
      }

      retryPortraitGenerationBase(personas[index], index, updatePersona, customPrompt);
    },
    [personas, retryPortraitGenerationBase, updatePersona]
  );

  return {
    generatePortraitsForAll,
    retryPortraitGeneration,
  };
};
