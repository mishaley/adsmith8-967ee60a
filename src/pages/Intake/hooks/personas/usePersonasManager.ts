
import { usePersonaGeneration } from "./usePersonaGeneration";
import { usePortraitGeneration } from "./usePortraitGeneration";
import { usePersonaRegeneration } from "./usePersonaRegeneration";
import { usePersonaPortraits } from "./usePersonaPortraits";
import { Persona } from "../../components/Personas/types";
import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "../../utils/localStorage";
import { logDebug, logError, logInfo } from "@/utils/logging";

export const usePersonasManager = (offering: string, selectedCountry: string) => {
  // Reference to track if localStorage has been read
  const hasLoadedFromStorage = useRef(false);

  // Load personaCount from localStorage with default of 1
  const [personaCount, setPersonaCount] = useState<number>(() => {
    const count = loadFromLocalStorage<number>(STORAGE_KEYS.PERSONAS + "_count", 1);
    logDebug(`Loaded initial persona count: ${count}`, 'localStorage');
    return count;
  });
  
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
    if (hasLoadedFromStorage.current) return;
    
    try {
      const savedPersonas = loadFromLocalStorage<Persona[]>(STORAGE_KEYS.PERSONAS + "_data", []);
      const savedSummary = loadFromLocalStorage<string>(STORAGE_KEYS.PERSONAS + "_summary", "");
      
      // Only set if we have saved personas
      if (savedPersonas.length > 0) {
        logDebug(`Loaded ${savedPersonas.length} personas from localStorage`, 'localStorage');
        setPersonas(savedPersonas);
        hasLoadedFromStorage.current = true;
      } else {
        logDebug("No saved personas found in localStorage", 'localStorage');
      }
    } catch (error) {
      logError("Error loading personas from localStorage:", 'localStorage', error);
    }
  }, [setPersonas]);

  // Previous personas ref to avoid redundant saves
  const prevPersonasRef = useRef<string>("");

  // Persist personas whenever they change - improved to check if they have changed before saving
  useEffect(() => {
    try {
      if (loadedPersonas.length > 0) {
        // Stringify to compare with previous value
        const personasJSON = JSON.stringify(loadedPersonas);
        
        // Only save if changed
        if (personasJSON !== prevPersonasRef.current) {
          saveToLocalStorage(STORAGE_KEYS.PERSONAS + "_data", loadedPersonas);
          saveToLocalStorage(STORAGE_KEYS.PERSONAS + "_summary", summary);
          logDebug(`Saved ${loadedPersonas.length} personas to localStorage`, 'localStorage');
          
          // Update ref
          prevPersonasRef.current = personasJSON;
        }
      }
    } catch (error) {
      logError("Error saving personas to localStorage:", 'localStorage', error);
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
    logInfo(`Generating personas with count: ${personaCount}`, 'api');
    // Make sure we're passing the correct personaCount to the generation function
    return generatePersonasBase(offering, selectedCountry, personaCount, (newPersonas) => {
      if (!newPersonas || newPersonas.length === 0) {
        logError("No personas were generated", 'api');
        return;
      }
      
      logInfo(`Successfully generated ${newPersonas.length} personas, now triggering portrait generation`, 'api');
      
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
    logDebug(`Showing ${visible.length} of ${loadedPersonas.length} personas`, 'ui');
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
