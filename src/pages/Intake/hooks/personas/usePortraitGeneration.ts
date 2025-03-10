
import { useState } from "react";
import { Persona } from "../../components/Personas/types";
import { logInfo, logError } from "@/utils/logging";

export const usePortraitGeneration = () => {
  const [isGeneratingPortraits, setIsGeneratingPortraits] = useState(false);
  const [loadingPortraitIndices, setLoadingPortraitIndices] = useState<number[]>([]);

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
