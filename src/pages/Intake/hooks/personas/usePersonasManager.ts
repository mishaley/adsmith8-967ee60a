
import { usePersonaGeneration } from "./usePersonaGeneration";
import { usePortraitGeneration } from "./usePortraitGeneration";
import { usePersonaRegeneration } from "./usePersonaRegeneration";
import { usePersonaPortraits } from "./usePersonaPortraits";
import { Persona } from "../../components/Personas/types";
import { useCallback, useState, useEffect, useMemo } from "react";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "../../utils/localStorageUtils";
import { logDebug, logError, logInfo } from "@/utils/logging";

export const usePersonasManager = (offering: string, selectedCountry: string) => {
  // Load personaCount from localStorage with default of 1
  const [personaCount, setPersonaCount] = useState<number>(() => 
    loadFromLocalStorage<number>(STORAGE_KEYS.PERSONAS + "_count", 1));
  
  const {
    personas: loadedPersonas,
    summary,
    isGeneratingPersonas,
    generatePersonas: generatePersonasBase,
    updatePersona: updatePersonaBase,
    regenerateSinglePersona,
    setPersonas // Expose this from usePersonaGeneration
  } = usePersonaGeneration();

  // On initial load, attempt to load personas from localStorage
  useEffect(() => {
    try {
      const savedPersonas = loadFromLocalStorage<Persona[]>(STORAGE_KEYS.PERSONAS + "_data", []);
      const savedSummary = loadFromLocalStorage<string>(STORAGE_KEYS.PERSONAS + "_summary", "");
      
      // Only set if we have saved personas
      if (savedPersonas.length > 0) {
        logDebug(`Loaded ${savedPersonas.length} personas from localStorage`);
        setPersonas(savedPersonas);
      } else {
        logDebug("No saved personas found in localStorage");
      }
    } catch (error) {
      logError("Error loading personas from localStorage:", error);
    }
  }, [setPersonas]);

  // Persist personas whenever they change - improved to check if they have changed before saving
  useEffect(() => {
    try {
      if (loadedPersonas.length > 0) {
        // Only save if we actually have personas to save
        saveToLocalStorage(STORAGE_KEYS.PERSONAS + "_data", loadedPersonas);
        saveToLocalStorage(STORAGE_KEYS.PERSONAS + "_summary", summary);
        logDebug(`Saved ${loadedPersonas.length} personas to localStorage`);
      }
    } catch (error) {
      logError("Error saving personas to localStorage:", error);
    }
  }, [loadedPersonas, summary]);

  // Persist personaCount whenever it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.PERSONAS + "_count", personaCount);
  }, [personaCount]);

  // Wrap the updatePersona function to also persist changes
  const updatePersona = useCallback((index: number, updatedPersona: Persona) => {
    updatePersonaBase(index, updatedPersona);
    // Persistence happens in the useEffect above when loadedPersonas changes
  }, [updatePersonaBase]);

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
    loadedPersonas, 
    retryPortraitBase, 
    updatePersona
  );

  const { 
    regeneratePersona, 
    removePersona 
  } = usePersonaRegeneration(
    loadedPersonas, 
    offering, 
    selectedCountry,
    regenerateSinglePersona,
    retryPortraitBase,
    updatePersona
  );

  // The most important function - generate personas and IMMEDIATELY trigger portrait generation
  const generatePersonas = useCallback(() => {
    logInfo(`Generating personas with count: ${personaCount}`);
    // Make sure we're passing the correct personaCount to the generation function
    return generatePersonasBase(offering, selectedCountry, personaCount, (newPersonas) => {
      if (!newPersonas || newPersonas.length === 0) {
        logError("No personas were generated");
        return;
      }
      
      logInfo(`Successfully generated ${newPersonas.length} personas, now triggering portrait generation`);
      
      // Only generate portraits for the personas that were generated
      // which should match the personaCount
      generatePortraitsForAll(newPersonas, generatePortraitsForAllPersonas);
    });
  }, [offering, selectedCountry, personaCount, generatePersonasBase, generatePortraitsForAll, generatePortraitsForAllPersonas]);

  // Use useMemo to limit re-renders of the personas array
  const visiblePersonas = useMemo(() => {
    if (loadedPersonas.length === 0) {
      return [];
    }
    
    const visible = loadedPersonas.slice(0, personaCount);
    logInfo(`Showing ${visible.length} of ${loadedPersonas.length} personas`);
    return visible;
  }, [loadedPersonas, personaCount]);

  // Also filter loadingPortraitIndices to match the visible personas
  const visibleLoadingIndices = useMemo(() => 
    loadingPortraitIndices.filter(index => index < personaCount),
    [loadingPortraitIndices, personaCount]
  );

  return {
    // Only return the first `personaCount` personas to ensure UI matches the selected count
    personas: visiblePersonas,
    summary,
    isGeneratingPersonas,
    isGeneratingPortraits,
    loadingPortraitIndices: visibleLoadingIndices,
    generatePersonas,
    updatePersona,
    retryPortraitGeneration,
    regeneratePersona,
    removePersona,
    personaCount,
    setPersonaCount
  };
};
