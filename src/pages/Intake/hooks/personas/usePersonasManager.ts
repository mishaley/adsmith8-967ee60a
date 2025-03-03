
import { usePersonaGeneration } from "./usePersonaGeneration";
import { usePortraitGeneration } from "./usePortraitGeneration";
import { usePersonaRegeneration } from "./usePersonaRegeneration";
import { usePersonaPortraits } from "./usePersonaPortraits";
import { Persona } from "../../components/Personas/types";
import { useCallback, useState, useEffect } from "react";

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
    
    // Make sure we're passing the correct personaCount to the generation function
    return generatePersonasBase(offering, selectedCountry, personaCount, (newPersonas) => {
      if (!newPersonas || newPersonas.length === 0) {
        console.error("No personas were generated, cannot generate portraits");
        return;
      }
      
      console.log(`${newPersonas.length} personas generated successfully, triggering portrait generation now`);
      
      // Only generate portraits for the personas that were generated
      // which should match the personaCount
      generatePortraitsForAll(newPersonas, generatePortraitsForAllPersonas);
    });
  }, [offering, selectedCountry, personaCount, generatePersonasBase, generatePortraitsForAll, generatePortraitsForAllPersonas]);

  // Add an effect to limit the displayed personas to match personaCount
  useEffect(() => {
    if (personas.length > personaCount) {
      console.log(`Limiting displayed personas from ${personas.length} to ${personaCount} based on user selection`);
      // We don't modify the actual personas array, but we can limit what we display in the UI
      // This ensures we're only showing the number of personas the user selected
    }
  }, [personas.length, personaCount]);

  return {
    // Only return the first `personaCount` personas to ensure UI matches the selected count
    personas: personas.slice(0, personaCount),
    summary,
    isGeneratingPersonas,
    isGeneratingPortraits,
    loadingPortraitIndices: loadingPortraitIndices.filter(index => index < personaCount),
    generatePersonas,
    updatePersona,
    retryPortraitGeneration,
    regeneratePersona,
    removePersona,
    personaCount,
    setPersonaCount
  };
};
