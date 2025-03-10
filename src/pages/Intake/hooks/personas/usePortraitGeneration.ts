
import { useState, useEffect } from "react";
import { Persona } from "../../components/Personas/types";
import { createPortraitPrompt } from "../../components/Personas/utils/portraitUtils";
import { supabase } from "@/integrations/supabase/client";
import { logDebug, logError, logInfo } from "@/utils/logging";

export const usePortraitGeneration = () => {
  const [isGeneratingPortraits, setIsGeneratingPortraits] = useState(false);
  const [loadingPortraitIndices, setLoadingPortraitIndices] = useState<number[]>([]);

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

  const generatePortraitForPersona = async (
    persona: Persona,
    index: number,
    updatePersonaCallback: (index: number, updatedPersona: Persona) => void,
    customPrompt?: string
  ) => {
    try {
      setLoadingPortraitIndices(prev => [...prev, index]);

      const prompt = customPrompt || createPortraitPrompt(persona);
      logDebug(`Generating portrait for persona ${index} with prompt: ${prompt}`);

      const { data, error } = await supabase.functions.invoke('generate-persona-image', {
        body: { prompt }
      });

      if (error) {
        logError(`Error generating portrait for persona ${index}:`, 'api', error);
        throw new Error(`Failed to generate portrait: ${error.message}`);
      }

      if (!data.success || !data.imageUrl) {
        const errorMsg = data.error || 'No image URL returned';
        logError(`Portrait generation failed for persona ${index}: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      logInfo(`Successfully generated portrait for persona ${index}`);
      
      // Update the persona with the new portrait URL
      const updatedPersona = {
        ...persona,
        portraitUrl: data.imageUrl
      };
      
      updatePersonaCallback(index, updatedPersona);

    } catch (error) {
      logError(`Portrait generation error for persona ${index}:`, 'api', error);
      // We don't rethrow here to allow other portraits to continue generating
    } finally {
      setLoadingPortraitIndices(prev => prev.filter(i => i !== index));
    }
  };

  const generatePortraitsForAllPersonas = async (
    personas: Persona[],
    updatePersonaCallback: (index: number, updatedPersona: Persona) => void,
    customPrompt?: string
  ) => {
    if (!personas || personas.length === 0) {
      logInfo("No personas provided for portrait generation");
      return;
    }

    setIsGeneratingPortraits(true);
    logInfo(`Starting portrait generation for ${personas.length} personas`);

    try {
      // Generate portraits sequentially to avoid overwhelming the API
      for (let i = 0; i < personas.length; i++) {
        const persona = personas[i];
        if (!persona.portraitUrl) { // Only generate if no portrait exists
          await generatePortraitForPersona(persona, i, updatePersonaCallback, customPrompt);
        }
      }
    } finally {
      setIsGeneratingPortraits(false);
    }
  };

  return {
    isGeneratingPortraits,
    loadingPortraitIndices,
    generatePortraitsForAllPersonas,
    retryPortraitGeneration: generatePortraitForPersona
  };
};
