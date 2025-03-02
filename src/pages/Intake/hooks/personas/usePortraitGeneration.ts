
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
      console.log(`Starting portrait generation for persona ${index + 1}:`, persona);
      
      // Assign a random race if not already present
      let personaToUse = { ...persona };
      if (!personaToUse.race) {
        personaToUse = {
          ...personaToUse,
          race: getRandomRace()
        };
      }
      
      // The portrait service now has built-in unlimited retries
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
    } catch (error) {
      console.error(`Exception generating portrait for persona ${index + 1}:`, error);
      setLoadingPortraitIndices(prev => prev.filter(idx => idx !== index));
      return { success: false, error, updatedPersona: null };
    }
  };

  const generatePortraitsForAllPersonas = async (personasList: Persona[], updatePersonaCallback: (index: number, updatedPersona: Persona) => void) => {
    if (personasList.length === 0) return;
    
    setIsGeneratingPortraits(true);
    console.log("Starting portrait generation for all personas:", personasList);
    toast.info("Generating portraits for all personas...");
    
    // Start with all indices as loading
    const initialLoadingIndices = personasList
      .map((persona, index) => !persona.portraitUrl ? index : null)
      .filter((index): index is number => index !== null);
    
    setLoadingPortraitIndices(initialLoadingIndices);
    
    let errorCount = 0;
    let successCount = 0;
    
    try {
      console.log(`Starting portrait generation for ${personasList.length} personas`);
      
      // Strict sequential processing with proper delays between requests
      for (let i = 0; i < personasList.length; i++) {
        const persona = personasList[i];
        
        // Skip if portrait already exists
        if (persona.portraitUrl) {
          console.log(`Portrait for persona ${i + 1} already exists, skipping...`);
          continue;
        }
        
        console.log(`Starting portrait generation for persona ${i + 1} of ${personasList.length}`);
        const result = await generatePortraitForPersona(persona, i);
        
        if (result?.success && result.updatedPersona) {
          successCount++;
          // Update persona in the parent state immediately when available
          updatePersonaCallback(i, result.updatedPersona);
          
          // Save portraits to session after each successful generation
          const updatedPersonasList = [...personasList];
          updatedPersonasList[i] = result.updatedPersona;
          savePortraitsToSession(updatedPersonasList);
          
          console.log(`Successfully generated portrait for persona ${i + 1}`);
          
          // Add a proper delay between successful requests to avoid overwhelming the API
          if (i < personasList.length - 1) {
            console.log("Waiting 4 seconds before generating next portrait...");
            await new Promise(resolve => setTimeout(resolve, 4000));
          }
        } else {
          errorCount++;
          console.error(`Failed to generate portrait for persona ${i + 1}`);
          
          // Make a second attempt immediately
          console.log(`Making a second attempt for persona ${i + 1}...`);
          const secondAttempt = await generatePortraitForPersona(persona, i);
          
          if (secondAttempt?.success && secondAttempt.updatedPersona) {
            successCount++;
            errorCount--; // Correct the error count since we succeeded on second try
            
            // Update persona in the parent state
            updatePersonaCallback(i, secondAttempt.updatedPersona);
            
            // Save portraits to session
            const updatedPersonasList = [...personasList];
            updatedPersonasList[i] = secondAttempt.updatedPersona;
            savePortraitsToSession(updatedPersonasList);
            
            console.log(`Second attempt succeeded for persona ${i + 1}`);
          } else {
            console.error(`Second attempt also failed for persona ${i + 1}`);
          }
          
          // Still add a delay even after failure to avoid hammering the API
          if (i < personasList.length - 1) {
            console.log("Waiting 4 seconds before attempting next portrait...");
            await new Promise(resolve => setTimeout(resolve, 4000));
          }
        }
      }
      
      console.log(`Portrait generation complete. Success: ${successCount}, Errors: ${errorCount}`);
      
      if (errorCount === 0 && successCount > 0) {
        toast.success("All portraits have been generated");
      } else if (successCount > 0 && errorCount > 0) {
        toast.warning(`Generated ${successCount} out of ${personasList.length} portraits. Click 'Retry Manually' for failed ones.`);
      } else if (successCount === 0) {
        toast.error("Failed to generate any portraits. The Supabase edge function may be unavailable.");
      }
    } catch (error) {
      console.error("Error in portrait generation process:", error);
      toast.error("Failed to complete portrait generation");
    } finally {
      setIsGeneratingPortraits(false);
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
        toast.error(`Failed to generate portrait for persona ${index + 1}. The edge function may be unavailable.`);
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
