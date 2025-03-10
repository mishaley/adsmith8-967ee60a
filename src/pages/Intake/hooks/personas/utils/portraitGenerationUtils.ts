
import { toast } from "sonner";
import { Persona } from "../../../components/Personas/types";
import { getRandomRace } from "../../../components/Personas/utils/portraitUtils";

/**
 * Prepares personas for portrait generation by adding missing required fields
 */
export const preparePersonasForPortraits = (personas: Persona[]): Persona[] => {
  if (!personas || personas.length === 0) {
    return [];
  }

  return personas.map(persona => {
    if (!persona) return null;
    
    // If race is missing, assign a random one
    if (!persona.race) {
      return { ...persona, race: getRandomRace() };
    }
    
    return persona;
  }).filter(Boolean) as Persona[];
};

/**
 * Displays appropriate toast messages for portrait generation results
 */
export const handlePortraitGenerationResult = (
  result: { imageUrl?: string; error?: string },
  personaName: string
): boolean => {
  if (result.error) {
    toast.error(`Failed to generate portrait for ${personaName}: ${result.error}`);
    return false;
  }
  
  if (!result.imageUrl) {
    toast.error(`No portrait URL returned for ${personaName}`);
    return false;
  }
  
  toast.success(`Portrait generated for ${personaName}`);
  return true;
};
