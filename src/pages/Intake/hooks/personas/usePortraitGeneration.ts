
import { useState, useEffect } from "react";
import { Persona } from "../../components/Personas/types";
import { logInfo, logError } from "@/utils/logging";
import { STORAGE_KEYS, loadFromLocalStorage } from "../../utils/localStorageUtils";

export const usePortraitGeneration = () => {
  const [isGeneratingPortraits, setIsGeneratingPortraits] = useState(false);
  const [loadingPortraitIndices, setLoadingPortraitIndices] = useState<number[]>([]);

  // Listen for localStorage changes (specifically when form is cleared)
  useEffect(() => {
    const handleStorage = () => {
      // Check if the personas data was cleared
      const personasData = loadFromLocalStorage<Persona[]>(`${STORAGE_KEYS.PERSONAS}_data`, []);
      if (personasData.length === 0) {
        // Reset our local state
        setIsGeneratingPortraits(false);
        setLoadingPortraitIndices([]);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Listen for clear form event
  useEffect(() => {
    const handleClearForm = () => {
      logInfo("Clear form event detected in usePortraitGeneration");
      setIsGeneratingPortraits(false);
      setLoadingPortraitIndices([]);
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => window.removeEventListener('clearForm', handleClearForm);
  }, []);

  // Simplified implementation with portrait generation disabled
  const generatePortraitsForAllPersonas = async (
    personas?: Persona[],
    updatePersonaCallback?: (index: number, updatedPersona: Persona) => void,
    customPrompt?: string
  ) => {
    // Portrait generation is intentionally disabled
    logInfo("Portrait generation is currently disabled");
    return;
  };

  // Simplified implementation with retry functionality disabled
  const retryPortraitGeneration = async (
    persona: Persona,
    index: number,
    updatePersonaCallback: (index: number, updatedPersona: Persona) => void,
    customPrompt?: string
  ) => {
    // Portrait generation retry is intentionally disabled
    logInfo("Portrait regeneration is currently disabled");
    return;
  };

  return {
    isGeneratingPortraits,
    loadingPortraitIndices,
    generatePortraitsForAllPersonas,
    retryPortraitGeneration,
    promptTemplate: ""
  };
};
