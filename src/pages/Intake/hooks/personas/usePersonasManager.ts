
import { usePersonaGeneration } from "./usePersonaGeneration";
import { usePortraitGeneration } from "./usePortraitGeneration";
import { Persona } from "../../components/Personas/types";
import { savePortraitsToSession } from "../../components/Personas/utils/portraitUtils";
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

  // Wrapper for generatePersonas that also triggers portrait generation
  const generatePersonas = async () => {
    generatePersonasBase(offering, selectedCountry, (newPersonas) => {
      // Start portrait generation after personas are generated
      generatePortraitsForAllPersonas(newPersonas, (index, updatedPersona) => {
        // Update a single persona with its portrait
        updatePersona(index, updatedPersona);
        
        // Save updated personas to session
        const updatedPersonas = [...personas];
        updatedPersonas[index] = updatedPersona;
        savePortraitsToSession(updatedPersonas);
      });
    });
  };

  // Regenerate a single persona and its portrait
  const regeneratePersona = useCallback(async (index: number) => {
    // First regenerate the persona
    const newPersona = await regenerateSinglePersona(index, offering, selectedCountry);
    
    if (newPersona) {
      // Then generate a portrait for it
      retryPortraitBase(newPersona, index, (idx, updatedPersona) => {
        updatePersona(idx, updatedPersona);
        
        // Save updated personas to session
        const updatedPersonas = [...personas];
        updatedPersonas[idx] = updatedPersona;
        savePortraitsToSession(updatedPersonas);
      });
    }
  }, [personas, offering, selectedCountry, regenerateSinglePersona, retryPortraitBase, updatePersona]);

  // Wrapper for retryPortraitGeneration
  const retryPortraitGeneration = (index: number) => {
    if (!personas[index]) return;
    
    retryPortraitBase(personas[index], index, (idx, updatedPersona) => {
      updatePersona(idx, updatedPersona);
      
      // Save updated personas to session
      const updatedPersonas = [...personas];
      updatedPersonas[idx] = updatedPersona;
      savePortraitsToSession(updatedPersonas);
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
    regeneratePersona
  };
};
