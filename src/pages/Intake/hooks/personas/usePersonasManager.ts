
import { usePersonaGeneration } from "./usePersonaGeneration";
import { usePortraitGeneration } from "./usePortraitGeneration";
import { usePersonaRegeneration } from "./usePersonaRegeneration";
import { usePersonaPortraits } from "./usePersonaPortraits";
import { Persona } from "../../components/Personas/types";

export const usePersonasManager = (offering: string, selectedCountry: string) => {
  const {
    personas,
    summary,
    isGeneratingPersonas,
    generatePersonas: generatePersonasBase,
    updatePersona,
    regenerateSinglePersona
  } = usePersonaGeneration();

  const {
    isGeneratingPortraits,
    loadingPortraitIndices,
    failedPortraitIndices,
    generatePortraitsForAllPersonas,
    retryPortraitGeneration: retryPortraitBase
  } = usePortraitGeneration();

  const { 
    generatePortraitsForAll, 
    retryPortraitGeneration 
  } = usePersonaPortraits(
    personas, 
    retryPortraitBase, 
    updatePersona
  );

  const { 
    regeneratePersona, 
    removePersona 
  } = usePersonaRegeneration(
    personas, 
    offering, 
    selectedCountry,
    regenerateSinglePersona,
    retryPortraitBase,
    updatePersona
  );

  // Wrapper for generatePersonas that also triggers portrait generation
  const generatePersonas = async () => {
    generatePersonasBase(offering, selectedCountry, (newPersonas) => {
      // Start portrait generation after personas are generated
      generatePortraitsForAll(generatePortraitsForAllPersonas);
    });
  };

  return {
    personas,
    summary,
    isGeneratingPersonas,
    isGeneratingPortraits,
    loadingPortraitIndices,
    failedPortraitIndices,
    generatePersonas,
    updatePersona,
    retryPortraitGeneration,
    regeneratePersona,
    removePersona
  };
};
