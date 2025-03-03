
import { usePersonaGeneration } from "./usePersonaGeneration";
import { usePortraitGeneration } from "./usePortraitGeneration";
import { usePersonaRegeneration } from "./usePersonaRegeneration";
import { usePersonaPortraits } from "./usePersonaPortraits";
import { Persona } from "../../components/Personas/types";
import { useCallback, useState } from "react";

export const usePersonasManager = (offering: string, selectedCountry: string) => {
  const [personaCount, setPersonaCount] = useState<number>(1);
  
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
    console.log(`Starting persona generation for ${personaCount} personas with automatic portrait generation to follow`);
    
    return generatePersonasBase(offering, selectedCountry, personaCount, (newPersonas) => {
      if (!newPersonas || newPersonas.length === 0) {
        console.error("No personas were generated, cannot generate portraits");
        return;
      }
      
      console.log(`${newPersonas.length} personas generated successfully, triggering portrait generation now`);
      
      // CRITICAL FIX: Pass the newPersonas directly to the portrait generation function
      // instead of relying on the state update to have completed
      generatePortraitsForAll(newPersonas, generatePortraitsForAllPersonas);
    });
  }, [offering, selectedCountry, personaCount, generatePersonasBase, generatePortraitsForAll, generatePortraitsForAllPersonas]);

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
    removePersona,
    personaCount,
    setPersonaCount
  };
};
