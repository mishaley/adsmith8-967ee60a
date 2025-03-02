
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Persona } from "../types";
import { generatePersonaPortrait } from "../services/portraitService";
import { getRandomRace, savePortraitsToSession } from "../utils/portraitUtils";

// This hook has been refactored and simplified.
// The portrait generation functionality has been moved to IntakeForm.tsx
export const usePersonaPortraits = (
  personas: Persona[],
  updatePersona?: (index: number, updatedPersona: Persona) => void
) => {
  const [generatingPortraitFor, setGeneratingPortraitFor] = useState<number | null>(null);
  const [generatingAllPortraits, setGeneratingAllPortraits] = useState<boolean>(false);
  const { toast } = useToast();

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

  return {
    generatingPortraitFor,
    generatingAllPortraits,
    generatePortrait,
    savePortraitsToSession
  };
};
