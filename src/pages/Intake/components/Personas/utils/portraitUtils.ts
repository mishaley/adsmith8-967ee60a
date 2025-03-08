
import { Persona } from "../types";

// Race distribution as specified
const RACE_DISTRIBUTION = [
  "White", "White", "White", "Latino", "Latino", 
  "Black", "Black", "Asian", "Indian-American", "Biracial"
];

// Function to randomly select a race from the distribution
export const getRandomRace = (): string => {
  const randomIndex = Math.floor(Math.random() * RACE_DISTRIBUTION.length);
  return RACE_DISTRIBUTION[randomIndex];
};

// Save portrait URLs to session storage
export const savePortraitsToSession = (personaList: Persona[]) => {
  try {
    const portraitUrls = personaList.map(p => p.portraitUrl || p.imageUrl || "");
    sessionStorage.setItem("personaPortraits", JSON.stringify(portraitUrls));
  } catch (error) {
    console.error("Error saving portraits to session storage:", error);
  }
};

// Load portraits from session storage
export const loadPortraitsFromSession = (
  personas: Persona[],
  updatePersona?: (index: number, updatedPersona: Persona) => void
): void => {
  if (personas.length === 0 || !updatePersona) return;
  
  try {
    const storedPortraits = sessionStorage.getItem("personaPortraits");
    if (storedPortraits) {
      const portraitsData = JSON.parse(storedPortraits);
      
      // Update personas with stored portrait URLs
      personas.forEach((persona, index) => {
        if (portraitsData[index]) {
          updatePersona(index, { ...persona, portraitUrl: portraitsData[index] });
        }
      });
    }
  } catch (error) {
    console.error("Error loading portraits from session storage:", error);
  }
};

// Create enhanced prompt for portrait generation
export const createPortraitPrompt = (persona: Persona): string => {
  // Get the age range - either from ageMin/ageMax or split the age if it exists
  const ageRange = (persona.ageMin && persona.ageMax) 
    ? `${persona.ageMin}-${persona.ageMax}` 
    : persona.age || "25-35"; // Default age range if none provided
  
  // Enhanced prompt that incorporates interests in a more exaggerated, interesting way
  const interestsDescription = persona.interests && persona.interests.length > 0 
    ? `Their personality visibly reflects their passions: ${persona.interests.join(", ")}. They are seen wearing or holding items related to these interests, with subtle visual cues in the background.` 
    : "";
    
  return `Portrait style magazine quality photo of a ${persona.race} ${persona.gender}, age ${ageRange}, who is ${persona.title.toLowerCase()}. ${interestsDescription} High-end fashion magazine photoshoot with creative dramatic lighting, expressive facial features, artistic composition, vibrant colors, headshot with character, pristine quality.`;
};
