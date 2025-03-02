
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

  const generatePortraitsForAllPersonas = async (personasList: Persona[]) => {
    if (personasList.length === 0) return;
    
    setIsGeneratingPortraits(true);
    toast.info("Generating portraits for all personas...");
    
    const updatedPersonas = [...personasList];
    let errorCount = 0;
    
    try {
      // Generate portraits for each persona sequentially
      for (let i = 0; i < personasList.length; i++) {
        if (errorCount >= 3) {
          // Stop trying after 3 consecutive errors
          toast.error("Too many errors while generating portraits. Please try again later.");
          break;
        }
        
        let persona = personasList[i];
        
        // Skip if portrait already exists
        if (persona.portraitUrl) {
          console.log(`Portrait for persona ${i + 1} already exists, skipping...`);
          continue;
        }
        
        // Assign a random race if not already present
        if (!persona.race) {
          persona = {
            ...persona,
            race: getRandomRace()
          };
          updatedPersonas[i] = persona;
        }
        
        try {
          const { imageUrl, error } = await generatePersonaPortrait(persona);
          
          if (imageUrl) {
            errorCount = 0; // Reset error count on success
            updatedPersonas[i] = {
              ...persona,
              portraitUrl: imageUrl
            };
            // Immediately update the personas state after each successful portrait generation
            setPersonas([...updatedPersonas]);
            // Save partial progress to session storage
            savePortraitsToSession(updatedPersonas);
          } else if (error) {
            errorCount++;
            console.error(`Error generating portrait for persona ${i + 1}:`, error);
          }
        } catch (portraitError) {
          errorCount++;
          console.error(`Exception generating portrait for persona ${i + 1}:`, portraitError);
        }
        
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (errorCount === 0) {
        toast.success("All portraits have been generated");
      } else if (errorCount < personasList.length) {
        toast.warning(`Generated ${personasList.length - errorCount} out of ${personasList.length} portraits`);
      }
    } catch (error) {
      console.error("Error in portrait generation process:", error);
      toast.error("Failed to complete portrait generation");
    } finally {
      setIsGeneratingPortraits(false);
    }
  };

  const generatePersonas = async () => {
    if (!offering) {
      toast.error("Please enter an offering first");
      return;
    }

    setIsGeneratingPersonas(true);
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
        
        // Automatically generate portraits for all personas
        await generatePortraitsForAllPersonas(normalizedPersonas);
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
    updatePersona
  };
};
