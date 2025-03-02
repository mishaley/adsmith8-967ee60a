
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../components/Personas/types";
import { generatePersonaSummary, normalizeGender } from "../utils/personaUtils";
import { generatePersonaPortrait } from "../components/Personas/services/portraitService";
import { getRandomRace, savePortraitsToSession } from "../components/Personas/utils/portraitUtils";

export const usePersonasGeneration = (offering: string, selectedCountry: string) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);
  const [isGeneratingPortraits, setIsGeneratingPortraits] = useState(false);
  const [summary, setSummary] = useState("");
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
        // Update personas state immediately when the portrait is ready
        setPersonas(prevPersonas => {
          const newPersonas = [...prevPersonas];
          newPersonas[index] = {
            ...newPersonas[index],
            portraitUrl: imageUrl,
            race: personaToUse.race // Make sure to save the race used
          };
          
          // Save updated personas to session storage
          savePortraitsToSession(newPersonas);
          
          return newPersonas;
        });
        
        return { success: true, error: null };
      } else if (error) {
        console.error(`Error generating portrait for persona ${index + 1}:`, error);
        return { success: false, error };
      }
    } catch (error) {
      console.error(`Exception generating portrait for persona ${index + 1}:`, error);
      setLoadingPortraitIndices(prev => prev.filter(idx => idx !== index));
      return { success: false, error };
    }
  };

  const generatePortraitsForAllPersonas = async (personasList: Persona[]) => {
    if (personasList.length === 0) return;
    
    setIsGeneratingPortraits(true);
    toast.info("Generating portraits for all personas...");
    
    const updatedPersonas = [...personasList];
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
        return { 
          index, 
          imageUrl: result?.success ? updatedPersonas[index].portraitUrl : null, 
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
  const retryPortraitGeneration = async (index: number) => {
    if (!personas[index]) return;

    try {
      setIsGeneratingPortraits(true);
      const result = await generatePortraitForPersona(personas[index], index);
      
      if (result?.success) {
        toast.success(`Portrait for ${personas[index].title} has been generated`);
      } else {
        toast.error(`Failed to generate portrait for ${personas[index].title}`);
      }
    } catch (error) {
      console.error(`Error retrying portrait for persona ${index + 1}:`, error);
      toast.error(`Failed to generate portrait: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsGeneratingPortraits(false);
    }
  };

  const generatePersonas = async () => {
    if (!offering) {
      toast.error("Please enter an offering first");
      return;
    }

    // Reset states
    setIsGeneratingPersonas(true);
    setPersonas([]); // Clear existing personas to show we're starting fresh
    setSummary("");
    
    try {
      console.log("Calling generate-personas with product:", offering);
      
      const { data, error } = await supabase.functions.invoke('generate-personas', {
        body: { 
          product: offering || "ramen noodles",
          country: selectedCountry || undefined
        }
      });

      console.log("Response from generate-personas:", data, error);

      if (error) {
        console.error("Error generating personas:", error);
        toast.error("Failed to generate personas: " + error.message);
        return;
      }

      if (!data) {
        console.error("No data received from generate-personas");
        toast.error("No data received from the server");
        return;
      }

      // Check for the correct personas data structure
      const personasData = data.personas || data.customer_personas;
      
      if (personasData && Array.isArray(personasData)) {
        // Normalize gender values in the personas
        const normalizedPersonas = personasData.map((persona: Persona) => ({
          ...persona,
          gender: normalizeGender(persona.gender)
        }));
        
        console.log("Generated personas:", normalizedPersonas);
        setPersonas(normalizedPersonas);
        
        // Generate a summary with normalized personas
        const newSummary = generatePersonaSummary(offering, normalizedPersonas);
        setSummary(newSummary);
        
        toast.success("Personas generated successfully");
        
        // Immediately start generating portraits in parallel
        // This happens after we've already set the personas state, so text will show first
        generatePortraitsForAllPersonas(normalizedPersonas);
      } else {
        console.error("Invalid personas data format received:", data);
        toast.error("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGeneratingPersonas(false);
    }
  };

  const updatePersona = (index: number, updatedPersona: Persona) => {
    const updatedPersonas = [...personas];
    updatedPersonas[index] = updatedPersona;
    setPersonas(updatedPersonas);
  };

  return {
    personas,
    summary,
    isGeneratingPersonas,
    isGeneratingPortraits,
    loadingPortraitIndices,
    generatePersonas,
    updatePersona,
    retryPortraitGeneration
  };
};
