
import { Persona } from "../../../components/Personas/types";
import { savePortraitsToSession } from "../../../components/Personas/utils/portraitUtils";

/**
 * Update portraits in session storage after a persona is updated
 */
export const updateSessionWithPersonas = (personas: Persona[], updatedIndex: number, updatedPersona: Persona | null) => {
  const updatedPersonas = [...personas];
  updatedPersonas[updatedIndex] = updatedPersona;
  savePortraitsToSession(updatedPersonas);
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
  // Update a single persona with its portrait
  updatePersona(index, updatedPersona);
  
  // Save updated personas to session
  updateSessionWithPersonas(personas, index, updatedPersona);
};

