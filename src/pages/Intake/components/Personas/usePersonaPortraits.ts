
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Persona } from "./types";

const SESSION_STORAGE_KEY = "personaPortraits";

// Race distribution as specified
const RACE_DISTRIBUTION = [
  "White", "White", "White", "Latino", "Latino", 
  "Black", "Black", "Asian", "Indian-American", "Biracial"
];

// Function to randomly select a race from the distribution
const getRandomRace = (): string => {
  const randomIndex = Math.floor(Math.random() * RACE_DISTRIBUTION.length);
  return RACE_DISTRIBUTION[randomIndex];
};

export const usePersonaPortraits = (
  personas: Persona[],
  updatePersona?: (index: number, updatedPersona: Persona) => void
) => {
  const [generatingPortraitFor, setGeneratingPortraitFor] = useState<number | null>(null);
  const [generatingAllPortraits, setGeneratingAllPortraits] = useState<boolean>(false);
  const { toast } = useToast();

  // Load portraits from session storage when personas change
  useEffect(() => {
    if (personas.length > 0) {
      try {
        const storedPortraits = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (storedPortraits) {
          const portraitsData = JSON.parse(storedPortraits);
          
          // Update personas with stored portrait URLs
          personas.forEach((persona, index) => {
            if (portraitsData[index] && updatePersona) {
              updatePersona(index, { ...persona, portraitUrl: portraitsData[index] });
            }
          });
        }
      } catch (error) {
        console.error("Error loading portraits from session storage:", error);
      }
    }
  }, [personas.length]); // Only run when the number of personas changes

  // Save portrait URLs to session storage whenever a portrait is generated
  const savePortraitsToSession = (personaList: Persona[]) => {
    try {
      const portraitUrls = personaList.map(p => p.portraitUrl || "");
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(portraitUrls));
    } catch (error) {
      console.error("Error saving portraits to session storage:", error);
    }
  };

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
      
      const prompt = `Portrait style magazine quality photo of a ${personaWithRace.race} ${personaWithRace.gender}, age ${personaWithRace.ageMin}-${personaWithRace.ageMax}, who is ${personaWithRace.title.toLowerCase()}. ${personaWithRace.interests.join(", ")}. High-end fashion magazine photoshoot, professional lighting, clear facial features, headshot, pristine quality.`;
      
      const { data, error } = await supabase.functions.invoke('ideogram-test', {
        body: { prompt }
      });
      
      if (error) {
        console.error('Error generating portrait:', error);
        toast({
          title: "Portrait Generation Failed",
          description: `Error: ${error.message || 'Unknown error'}`,
          variant: "destructive",
        });
        return;
      }
      
      let imageUrl = null;
      if (data.imageUrl) {
        imageUrl = data.imageUrl;
      } else if (data.data && data.data.length > 0 && data.data[0].url) {
        imageUrl = data.data[0].url;
      }
      
      if (imageUrl) {
        // Create a new persona with the updated portrait URL
        const updatedPersona = { ...personaWithRace, portraitUrl: imageUrl };
        
        // Update the persona in the parent component if callback is provided
        if (updatePersona) {
          updatePersona(index, updatedPersona);
          
          // Save all portraits to session storage
          const updatedPersonas = [...personas];
          updatedPersonas[index] = updatedPersona;
          savePortraitsToSession(updatedPersonas);
        }
        
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
        
        const prompt = `Portrait style magazine quality photo of a ${personaWithRace.race} ${personaWithRace.gender}, age ${personaWithRace.ageMin}-${personaWithRace.ageMax}, who is ${personaWithRace.title.toLowerCase()}. ${personaWithRace.interests.join(", ")}. High-end fashion magazine photoshoot, professional lighting, clear facial features, headshot, pristine quality.`;
        
        const { data, error } = await supabase.functions.invoke('ideogram-test', {
          body: { prompt }
        });
        
        if (error) {
          console.error(`Error generating portrait for persona ${i}:`, error);
          continue; // Continue with the next persona even if one fails
        }
        
        let imageUrl = null;
        if (data.imageUrl) {
          imageUrl = data.imageUrl;
        } else if (data.data && data.data.length > 0 && data.data[0].url) {
          imageUrl = data.data[0].url;
        }
        
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
