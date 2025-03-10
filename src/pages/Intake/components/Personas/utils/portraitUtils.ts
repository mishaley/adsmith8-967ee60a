
import { Persona } from "../types";

/**
 * Default portrait prompt template with placeholders for persona details
 */
export const getPortraitPromptTemplate = (): string => {
  return `Portrait photograph, [RACE] [GENDER], age [AGE_MIN]-[AGE_MAX], interested in [INTEREST1] and [INTEREST2], studio lighting, neutral background, professional quality, photorealistic, high resolution`;
};

/**
 * Create a portrait prompt based on a persona
 */
export const createPortraitPrompt = (persona: Persona): string => {
  const race = persona.race || "diverse";
  const gender = persona.gender || "diverse";
  const ageMin = persona.ageMin || 25;
  const ageMax = persona.ageMax || 45;
  
  // Get the first two interests or provide defaults
  const interests = persona.interests || [];
  const interest1 = interests.length > 0 ? interests[0] : "technology";
  const interest2 = interests.length > 1 ? interests[1] : "culture";
  
  // Replace the placeholders with actual values
  return getPortraitPromptTemplate()
    .replace("[RACE]", race)
    .replace("[GENDER]", gender)
    .replace("[AGE_MIN]", String(ageMin))
    .replace("[AGE_MAX]", String(ageMax))
    .replace("[INTEREST1]", interest1)
    .replace("[INTEREST2]", interest2);
};

/**
 * Generate a random race for personas
 */
export const getRandomRace = (): string => {
  const races = [
    "Caucasian",
    "Asian",
    "Hispanic",
    "African American",
    "South Asian",
    "Middle Eastern",
    "East Asian",
    "Mediterranean"
  ];
  
  return races[Math.floor(Math.random() * races.length)];
};

/**
 * Save portrait URLs to session storage
 */
export const savePortraitsToSession = (personas: Persona[]): void => {
  try {
    // Store each persona's portrait URL independently for persistence
    personas.forEach((persona, index) => {
      if (persona.portraitUrl) {
        sessionStorage.setItem(`persona_${index}_portrait`, persona.portraitUrl);
      }
    });
  } catch (e) {
    console.warn('Failed to save portrait URLs to session storage:', e);
  }
};

/**
 * Load portrait URLs from session storage
 */
export const loadPortraitsFromSession = (personas: Persona[]): Persona[] => {
  try {
    return personas.map((persona, index) => {
      const savedUrl = sessionStorage.getItem(`persona_${index}_portrait`);
      if (savedUrl && !persona.portraitUrl) {
        return { ...persona, portraitUrl: savedUrl };
      }
      return persona;
    });
  } catch (e) {
    console.warn('Failed to load portrait URLs from session storage:', e);
    return personas;
  }
};
