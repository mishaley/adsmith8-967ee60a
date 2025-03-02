
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Persona } from "../types";
import { generatePersonaPortrait } from "../services/portraitService";
import { loadPortraitsFromSession, savePortraitsToSession, getRandomRace } from "../utils/portraitUtils";

export const usePersonaPortraits = (
  personas: Persona[],
  updatePersona?: (index: number, updatedPersona: Persona) => void
) => {
  const [generatingPortraitFor, setGeneratingPortraitFor] = useState<number | null>(null);
  const [generatingAllPortraits, setGeneratingAllPortraits] = useState<boolean>(false);
  const { toast } = useToast();

  // Load portraits from session storage when personas change
  useEffect(() => {
    if (personas.length > 0 && updatePersona) {
      loadPortraitsFromSession(personas, updatePersona);
    }
  }, [personas.length]); // Only run when the number of personas changes

  const generatePortrait = async (persona: Persona, index: number) => {
    if (generatingPortraitFor !== null || generatingAllPortraits) return;
    
    setGeneratingPortraitFor(index);
    try {
      // Assign a random race if not already present
      const personaWithRace = { ...persona };
      if (!personaWithRace.race) {
        personaWithRace.race = getRandomRace();
        // Update the persona with the race
        if (updatePersona) {
          updatePersona(index, personaWithRace);
        }
      }
      
      const { imageUrl, error } = await generatePersonaPortrait(personaWithRace);
      
      if (error) {
        toast({
          title: "Portrait Generation Failed",
          description: `Error: ${error.message || 'Unknown error'}`,
          variant: "destructive",
        });
        return;
      }
      
      if (imageUrl && updatePersona) {
        // Create a new persona with the updated portrait URL
        const updatedPersona = { ...personaWithRace, portraitUrl: imageUrl };
        
        // Update the persona in the parent component
        updatePersona(index, updatedPersona);
        
        // Save all portraits to session storage
        const updatedPersonas = [...personas];
        updatedPersonas[index] = updatedPersona;
        savePortraitsToSession(updatedPersonas);
        
        toast({
          title: "Portrait Generated",
          description: `Portrait for ${personaWithRace.title} has been generated.`,
        });
      } else {
        toast({
          title: "Portrait Generation Failed",
          description: "No image URL was found in the response.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in portrait generation:', error);
      toast({
        title: "Portrait Generation Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
    } finally {
      setGeneratingPortraitFor(null);
    }
  };

  const generateAllPortraits = async () => {
    if (personas.length === 0 || generatingAllPortraits || generatingPortraitFor !== null) {
      return;
    }

    setGeneratingAllPortraits(true);
    toast({
      title: "Generating All Portraits",
      description: "Starting generation of portraits for all personas...",
    });

    try {
      // Generate portraits for each persona sequentially
      for (let i = 0; i < personas.length; i++) {
        const persona = personas[i];
        
        // Skip if persona already has a portrait
        if (persona.portraitUrl) {
          continue;
        }
        
        // Assign a random race if not already present
        const personaWithRace = { ...persona };
        if (!personaWithRace.race) {
          personaWithRace.race = getRandomRace();
          // Update the persona with the race
          if (updatePersona) {
            updatePersona(i, personaWithRace);
          }
        }
        
        const { imageUrl } = await generatePersonaPortrait(personaWithRace);
        
        if (imageUrl && updatePersona) {
          const updatedPersona = { ...personaWithRace, portraitUrl: imageUrl };
          updatePersona(i, updatedPersona);
          
          // Get updated personas with the new portrait
          const updatedPersonas = [...personas];
          updatedPersonas[i] = updatedPersona;
          savePortraitsToSession(updatedPersonas);
        }
      }
      
      toast({
        title: "All Portraits Generated",
        description: "Finished generating portraits for all personas.",
      });
    } catch (error) {
      console.error('Error in generating all portraits:', error);
      toast({
        title: "Portrait Generation Incomplete",
        description: "Error occurred while generating all portraits.",
        variant: "destructive",
      });
    } finally {
      setGeneratingAllPortraits(false);
    }
  };

  return {
    generatingPortraitFor,
    generatingAllPortraits,
    generatePortrait,
    generateAllPortraits,
    savePortraitsToSession
  };
};
