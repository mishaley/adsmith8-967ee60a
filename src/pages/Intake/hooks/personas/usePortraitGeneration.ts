import { useState } from "react";
import { toast } from "sonner";
import { Persona } from "../../components/Personas/types";
import { generatePersonaPortrait } from "../../components/Personas/services/portraitService";
import { getRandomRace, savePortraitsToSession, getPortraitPromptTemplate } from "../../components/Personas/utils/portraitUtils";

export const usePortraitGeneration = () => {
  const [isGeneratingPortraits, setIsGeneratingPortraits] = useState(false);
  const [loadingPortraitIndices, setLoadingPortraitIndices] = useState<number[]>([]);
  const [promptTemplate, setPromptTemplate] = useState(getPortraitPromptTemplate());
  const [retryCount, setRetryCount] = useState<Record<number, number>>({});

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const generatePortraitForPersona = async (persona: Persona, index: number, customPrompt?: string) => {
    if (!persona) return null;
    
    // Mark this specific persona as loading
    setLoadingPortraitIndices(prev => {
      if (!prev.includes(index)) {
        return [...prev, index];
      }
      return prev;
    });
    
    try {
      // Track retry count for this index
      const currentRetries = retryCount[index] || 0;
      
      // Assign a random race if not already present
      let personaToUse = { ...persona };
      if (!personaToUse.race) {
        personaToUse = {
          ...personaToUse,
          race: getRandomRace()
        };
      }
      
      console.log(`Generating portrait for persona ${index} (attempt ${currentRetries + 1}/${MAX_RETRIES + 1})`);
      
      // Generate the portrait
      const { imageUrl, error } = await generatePersonaPortrait(personaToUse, customPrompt);
        
      // Remove this index from loading indices
      setLoadingPortraitIndices(prev => prev.filter(idx => idx !== index));
      
      if (imageUrl) {
        // Reset retry count on success
        setRetryCount(prev => ({...prev, [index]: 0}));
        
        return { 
          success: true, 
          error: null, 
          updatedPersona: {
            ...personaToUse,
            portraitUrl: imageUrl[0] // Store the generated portrait URL
          }
        };
      } else if (error) {
        console.error(`Portrait generation error for persona ${index}:`, error);
        
        // Check if we should retry
        if (currentRetries < MAX_RETRIES) {
          console.log(`Will retry portrait generation for persona ${index} in ${RETRY_DELAY}ms`);
          
          // Increment retry count
          setRetryCount(prev => ({...prev, [index]: currentRetries + 1}));
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          
          // Retry recursively
          return generatePortraitForPersona(persona, index, customPrompt);
        }
        
        // If we've exhausted retries, return the error
        return { success: false, error, updatedPersona: null };
      }
      
      return null;
    } catch (error) {
      console.error(`Exception in portrait generation for persona ${index}:`, error);
      setLoadingPortraitIndices(prev => prev.filter(idx => idx !== index));
      return { 
        success: false, 
        error: error instanceof Error ? error.toString() : String(error), 
        updatedPersona: null 
      };
    }
  };

  const generatePortraitsForAllPersonas = async (
    personasList: Persona[], 
    updatePersonaCallback: (index: number, updatedPersona: Persona) => void,
    customPrompt?: string
  ) => {
    if (!personasList || personasList.length === 0) {
      return;
    }
    
    setIsGeneratingPortraits(true);
    toast.info("Generating portraits for all personas...");
    
    // Start with all indices as loading
    const initialLoadingIndices = personasList
      .map((persona, index) => !persona.portraitUrl ? index : null)
      .filter((index): index is number => index !== null);
    
    setLoadingPortraitIndices(initialLoadingIndices);
    
    try {
      // Reset retry counts
      setRetryCount({});
      
      // Process personas in batches to avoid overwhelming the API
      // Here we use sequential processing instead of parallel
      let successCount = 0;
      let errorCount = 0;
      
      for (let index = 0; index < personasList.length; index++) {
        const persona = personasList[index];
        
        // Skip if portrait already exists
        if (persona.portraitUrl) {
          continue;
        }
        
        const result = await generatePortraitForPersona(persona, index, customPrompt);
        
        if (result?.success && result.updatedPersona) {
          // Update persona in the parent state
          updatePersonaCallback(index, result.updatedPersona);
          successCount++;
        } else {
          errorCount++;
          // Log the error for debugging
          console.warn(`Failed to generate portrait for persona ${index}:`, result?.error);
        }
      }
      
      // Generate status message
      if (errorCount === 0 && successCount > 0) {
        toast.success("All portraits have been generated");
      } else if (successCount > 0 && errorCount > 0) {
        toast.warning(`Generated ${successCount} out of ${initialLoadingIndices.length} portraits. Click 'Retry' for failed ones.`);
      } else if (successCount === 0) {
        toast.error("Failed to generate any portraits. Please try again.");
      }
      
      // Save successfully generated portraits to session storage
      savePortraitsToSession(personasList);
      
    } catch (error) {
      console.error("Exception in generatePortraitsForAllPersonas:", error);
      toast.error(error instanceof Error ? error.toString() : String(error));
    } finally {
      setIsGeneratingPortraits(false);
      // Clear any remaining loading indices
      setLoadingPortraitIndices([]);
    }
  };

  // Function to retry a single portrait generation
  const retryPortraitGeneration = async (
    index: number, 
    updatePersonaCallback: (index: number, updatedPersona: Persona) => void,
    customPrompt?: string
  ) => {
    const persona = null; // This will be provided by the parent component
    
    try {
      toast.info(`Retrying portrait for persona ${index + 1}`);
      setRetryCount({}); // Reset retry count for fresh attempt
      // The actual implementation will be completed when this function is called
    } catch (error) {
      toast.error(error instanceof Error ? error.toString() : String(error));
    }
  };

  return {
    isGeneratingPortraits,
    loadingPortraitIndices,
    generatePortraitsForAllPersonas,
    retryPortraitGeneration: async (
      persona: Persona, 
      index: number, 
      updatePersonaCallback: (index: number, updatedPersona: Persona) => void,
      customPrompt?: string
    ) => {
      if (!persona) return;

      try {
        toast.info(`Retrying portrait for persona ${index + 1}`);
        setIsGeneratingPortraits(true);
        setRetryCount({}); // Reset retry count for fresh attempt
        
        const result = await generatePortraitForPersona(persona, index, customPrompt);
        
        if (result?.success && result.updatedPersona) {
          updatePersonaCallback(index, result.updatedPersona);
          toast.success(`Portrait for persona ${index + 1} has been generated`);
        } else {
          toast.error(`Failed to generate portrait for persona ${index + 1}. Please try again.`);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.toString() : String(error));
      } finally {
        setIsGeneratingPortraits(false);
      }
    },
    promptTemplate
  };
};