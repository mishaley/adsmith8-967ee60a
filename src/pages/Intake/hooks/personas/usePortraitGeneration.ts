
import { useState } from "react";
import { toast } from "sonner";
import { Persona } from "../../components/Personas/types";
import { generatePersonaPortrait } from "../../components/Personas/services/portraitService";
import { getRandomRace, savePortraitsToSession } from "../../components/Personas/utils/portraitUtils";

export const usePortraitGeneration = () => {
  const [isGeneratingPortraits, setIsGeneratingPortraits] = useState(false);
  const [loadingPortraitIndices, setLoadingPortraitIndices] = useState<number[]>([]);

  const generatePortraitForPersona = async (persona: Persona, index: number) => {
    if (!persona) return;
    
    // Mark this specific persona as loading
    setLoadingPortraitIndices(prev => [...prev, index]);
    
    try {
      // Assign a random race if not already present
      let personaToUse = { ...persona };
      if (!personaToUse.race) {
        personaToUse = {
          ...personaToUse,
          race: getRandomRace()
        };
      }
      
      const { imageUrl, error } = await generatePersonaPortrait(personaToUse);
      
      // Remove this index from loading indices
      setLoadingPortraitIndices(prev => prev.filter(idx => idx !== index));
      
      if (imageUrl) {
        return { 
          success: true, 
          error: null, 
          updatedPersona: {
            ...personaToUse,
            portraitUrl: imageUrl
          }
        };
      } else if (error) {
        console.error(`Error generating portrait for persona ${index + 1}:`, error);
        return { success: false, error, updatedPersona: null };
      }
    } catch (error) {
      console.error(`Exception generating portrait for persona ${index + 1}:`, error);
      setLoadingPortraitIndices(prev => prev.filter(idx => idx !== index));
      return { success: false, error, updatedPersona: null };
    }
  };

  const generatePortraitsForAllPersonas = async (personasList: Persona[], updatePersonaCallback: (index: number, updatedPersona: Persona) => void) => {
    if (personasList.length === 0) return;
    
    setIsGeneratingPortraits(true);
    toast.info("Generating portraits for all personas...");
    
    let errorCount = 0;
    
    try {
      // Prepare all promises to run in parallel
      const portraitPromises = personasList.map(async (persona, index) => {
        // Skip if portrait already exists
        if (persona.portraitUrl) {
          console.log(`Portrait for persona ${index + 1} already exists, skipping...`);
          return { index, imageUrl: persona.portraitUrl, error: null };
        }
        
        // Individual portrait generation is now handled by generatePortraitForPersona
        const result = await generatePortraitForPersona(persona, index);
        if (result?.success && result.updatedPersona) {
          // Update persona in the parent state immediately when available
          updatePersonaCallback(index, result.updatedPersona);
        }
        
        return { 
          index, 
          imageUrl: result?.success ? result.updatedPersona?.portraitUrl : null, 
          error: result?.error || null 
        };
      });
      
      // Process results as they come in using Promise.allSettled
      const results = await Promise.allSettled(portraitPromises);
      
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          const { error } = result.value;
          
          if (error) {
            errorCount++;
            console.error(`Error generating portrait for persona ${i + 1}:`, error);
          }
        } else {
          // This handles the case where the promise itself rejected
          errorCount++;
          console.error(`Portrait generation for persona ${i + 1} failed:`, result.reason);
        }
      });
      
      if (errorCount === 0) {
        toast.success("All portraits have been generated");
      } else if (errorCount < personasList.length) {
        toast.warning(`Generated ${personasList.length - errorCount} out of ${personasList.length} portraits`);
      } else {
        toast.error("Failed to generate any portraits");
      }
    } catch (error) {
      console.error("Error in portrait generation process:", error);
      toast.error("Failed to complete portrait generation");
    } finally {
      setIsGeneratingPortraits(false);
      setLoadingPortraitIndices([]);
    }
  };

  // Function to retry a single portrait generation
  const retryPortraitGeneration = async (
    persona: Persona, 
    index: number, 
    updatePersonaCallback: (index: number, updatedPersona: Persona) => void
  ) => {
    if (!persona) return;

    try {
      setIsGeneratingPortraits(true);
      const result = await generatePortraitForPersona(persona, index);
      
      if (result?.success && result.updatedPersona) {
        updatePersonaCallback(index, result.updatedPersona);
        toast.success(`Portrait for ${persona.title} has been generated`);
      } else {
        toast.error(`Failed to generate portrait for ${persona.title}`);
      }
    } catch (error) {
      console.error(`Error retrying portrait for persona ${index + 1}:`, error);
      toast.error(`Failed to generate portrait: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsGeneratingPortraits(false);
    }
  };

  return {
    isGeneratingPortraits,
    loadingPortraitIndices,
    generatePortraitsForAllPersonas,
    retryPortraitGeneration
  };
};
