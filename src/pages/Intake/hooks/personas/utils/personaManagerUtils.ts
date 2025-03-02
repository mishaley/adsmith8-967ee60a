
import { Persona } from "../../../components/Personas/types";
import { savePortraitsToSession } from "../../../components/Personas/utils/portraitUtils";

/**
 * Update portraits in session storage after a persona is updated
 */
export const updateSessionWithPersonas = (personas: Persona[], updatedIndex: number, updatedPersona: Persona | null) => {
  if (!personas || personas.length === 0) {
    console.warn("Cannot update session storage: no personas available");
    return personas;
  }
  
  console.log(`Updating session storage for persona ${updatedIndex + 1}`);
  const updatedPersonas = [...personas];
  
  if (updatedPersona === null) {
    // Handle persona removal
    updatedPersonas[updatedIndex] = null;
  } else {
    // Update the persona with new data (including portrait)
    updatedPersonas[updatedIndex] = updatedPersona;
  }
  
  // Save to session storage
  savePortraitsToSession(updatedPersonas.filter(Boolean));
  return updatedPersonas;
};

/**
 * Handle portrait generation callback
 */
export const handlePortraitUpdateCallback = (
  index: number, 
  updatedPersona: Persona,
  personas: Persona[],
  updatePersona: (index: number, updatedPersona: Persona) => void
) => {
  console.log(`Handling portrait update for persona ${index + 1}:`, updatedPersona.portraitUrl ? "Portrait URL exists" : "No portrait URL");
  
  // Update a single persona with its portrait
  updatePersona(index, updatedPersona);
  
  // Make a copy of the personas array with the updated persona
  const updatedPersonas = [...personas];
  updatedPersonas[index] = updatedPersona;
  
  // Save updated personas to session
  savePortraitsToSession(updatedPersonas.filter(Boolean));
};
