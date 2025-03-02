
import { usePersonaGeneration } from "./usePersonaGeneration";
import { usePortraitGeneration } from "./usePortraitGeneration";
import { usePersonaRegeneration } from "./usePersonaRegeneration";
import { usePersonaPortraits } from "./usePersonaPortraits";
import { Persona } from "../../components/Personas/types";
import { useCallback } from "react";

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

  // The most important function - generate personas and IMMEDIATELY trigger portrait generation
  const generatePersonas = useCallback(() => {
    console.log("Starting persona generation with automatic portrait generation to follow");
    return generatePersonasBase(offering, selectedCountry, (newPersonas) => {
      if (!newPersonas || newPersonas.length === 0) {
        console.error("No personas were generated, cannot generate portraits");
        return;
      }
      
      console.log(`${newPersonas.length} personas generated successfully, triggering portrait generation now`);
      
      // CRITICAL: Trigger portrait generation with a very slight delay to ensure React has updated the state
      setTimeout(() => {
        // This is the key function call that triggers portrait generation
        generatePortraitsForAll(generatePortraitsForAllPersonas);
      }, 100);
    });
  }, [offering, selectedCountry, generatePersonasBase, generatePortraitsForAll, generatePortraitsForAllPersonas]);

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
