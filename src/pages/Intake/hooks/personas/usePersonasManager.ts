
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
      console.log("Personas generated, now generating portraits automatically");
      // Start portrait generation immediately after personas are generated
      if (newPersonas && newPersonas.length > 0) {
        // Use setTimeout to ensure the UI updates first
        setTimeout(() => {
          generatePortraitsForAll(generatePortraitsForAllPersonas);
        }, 500);
      }
    });
  };

  return {
    personas,
    summary,
    isGeneratingPersonas,
    isGeneratingPortraits,
    loadingPortraitIndices,
    generatePersonas,
    updatePersona,
    retryPortraitGeneration,
    regeneratePersona,
    removePersona
  };
};
