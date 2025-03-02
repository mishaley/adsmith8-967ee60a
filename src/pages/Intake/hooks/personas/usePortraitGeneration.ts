
import { useState } from "react";
import { toast } from "sonner";
import { Persona } from "../../components/Personas/types";
import { generatePersonaPortrait } from "../../components/Personas/services/portraitService";
import { getRandomRace, savePortraitsToSession } from "../../components/Personas/utils/portraitUtils";

export const usePortraitGeneration = () => {
  const [isGeneratingPortraits, setIsGeneratingPortraits] = useState(false);
  const [loadingPortraitIndices, setLoadingPortraitIndices] = useState<number[]>([]);

  const generatePortraitForPersona = async (persona: Persona, index: number) => {
    if (!persona) return null;
    
    // Mark this specific persona as loading
    setLoadingPortraitIndices(prev => {
      if (!prev.includes(index)) {
        return [...prev, index];
      }
      return prev;
    });
    
    try {
      console.log(`Starting portrait generation for persona ${index + 1}:`, persona);
      
      // Assign a random race if not already present
      let personaToUse = { ...persona };
      if (!personaToUse.race) {
        personaToUse = {
          ...personaToUse,
          race: getRandomRace()
        };
      }
      
      // Generate the portrait
      const { imageUrl, error } = await generatePersonaPortrait(personaToUse);
      
      // Remove this index from loading indices
      setLoadingPortraitIndices(prev => prev.filter(idx => idx !== index));
      
      if (imageUrl) {
        console.log(`Portrait generated successfully for persona ${index + 1}`);
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
      
      return null;
    } catch (error) {
      console.error(`Exception generating portrait for persona ${index + 1}:`, error);
      setLoadingPortraitIndices(prev => prev.filter(idx => idx !== index));
      return { success: false, error, updatedPersona: null };
    }
  };

  const generatePortraitsForAllPersonas = async (personasList: Persona[], updatePersonaCallback: (index: number, updatedPersona: Persona) => void) => {
    if (!personasList || personasList.length === 0) {
      console.warn("No personas to generate portraits for in generatePortraitsForAllPersonas");
      return;
    }
    
    setIsGeneratingPortraits(true);
    console.log("Starting parallel portrait generation for all personas:", personasList);
    toast.info("Generating portraits for all personas...");
    
    // Start with all indices as loading
    const initialLoadingIndices = personasList
      .map((persona, index) => !persona.portraitUrl ? index : null)
      .filter((index): index is number => index !== null);
    
    setLoadingPortraitIndices(initialLoadingIndices);
    
    try {
      console.log(`Starting parallel portrait generation for ${personasList.length} personas`);
      
      // Generate all portraits in parallel
      const portraitPromises = personasList.map(async (persona, index) => {
        // Skip if portrait already exists
        if (persona.portraitUrl) {
          console.log(`Portrait for persona ${index + 1} already exists, skipping...`);
          return { index, success: true, updatedPersona: persona };
        }
        
        console.log(`Starting portrait generation for persona ${index + 1} of ${personasList.length}`);
        const result = await generatePortraitForPersona(persona, index);
        
        if (result?.success && result.updatedPersona) {
          console.log(`Successfully generated portrait for persona ${index + 1}`);
          return { index, success: true, updatedPersona: result.updatedPersona };
        } else {
          console.error(`Failed to generate portrait for persona ${index + 1}`);
          
          // Make a second attempt right away
          console.log(`Making an immediate second attempt for persona ${index + 1}...`);
          const secondAttempt = await generatePortraitForPersona(persona, index);
          
          if (secondAttempt?.success && secondAttempt.updatedPersona) {
            console.log(`Second attempt succeeded for persona ${index + 1}`);
            return { index, success: true, updatedPersona: secondAttempt.updatedPersona };
          } else {
            console.error(`Second attempt also failed for persona ${index + 1}`);
            return { index, success: false, updatedPersona: null };
          }
        }
      });
      
      // Wait for all portrait generation attempts to complete
      const results = await Promise.all(portraitPromises);
      
      // Process results and update the UI
      const successCount = results.filter(r => r.success && r.updatedPersona).length;
      const errorCount = results.filter(r => !r.success || !r.updatedPersona).length;
      
      // Update personas with their portraits
      const updatedPersonasList = [...personasList];
      results.forEach(result => {
        if (result.success && result.updatedPersona) {
          // Update persona in the parent state
          updatePersonaCallback(result.index, result.updatedPersona);
          
          // Also update our local copy
          updatedPersonasList[result.index] = result.updatedPersona;
        }
      });
      
      // Save all portraits to session storage
      savePortraitsToSession(updatedPersonasList.filter(Boolean));
      
      console.log(`Parallel portrait generation complete. Success: ${successCount}, Errors: ${errorCount}`);
      
      if (errorCount === 0 && successCount > 0) {
        toast.success("All portraits have been generated");
      } else if (successCount > 0 && errorCount > 0) {
        toast.warning(`Generated ${successCount} out of ${personasList.length} portraits. Click 'Retry Manually' for failed ones.`);
      } else if (successCount === 0) {
        toast.error("Failed to generate any portraits. Please try again or click 'Retry Manually'.");
      }
    } catch (error) {
      console.error("Unexpected error in portrait generation process:", error);
      toast.error("Failed to complete portrait generation");
    } finally {
      setIsGeneratingPortraits(false);
      // Clear any remaining loading indices
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
      toast.info(`Retrying portrait for persona ${index + 1}`);
      setIsGeneratingPortraits(true);
      const result = await generatePortraitForPersona(persona, index);
      
      if (result?.success && result.updatedPersona) {
        updatePersonaCallback(index, result.updatedPersona);
        toast.success(`Portrait for persona ${index + 1} has been generated`);
      } else {
        toast.error(`Failed to generate portrait for persona ${index + 1}. Please try again.`);
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
