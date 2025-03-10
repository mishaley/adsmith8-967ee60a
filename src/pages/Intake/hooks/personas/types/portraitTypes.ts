
import { Persona } from "../../../components/Personas/types";

export interface PortraitGenerationState {
  isGeneratingPortraits: boolean;
  loadingPortraitIndices: number[];
}

export interface PortraitGenerationHook extends PortraitGenerationState {
  generatePortraitsForAllPersonas: (
    personas?: Persona[], 
    updatePersonaCallback?: (index: number, updatedPersona: Persona) => void, 
    customPrompt?: string
  ) => Promise<void>;
  retryPortraitGeneration: (
    persona: Persona, 
    index: number, 
    updatePersonaCallback: (index: number, updatedPersona: Persona) => void, 
    customPrompt?: string
  ) => Promise<void>;
  promptTemplate: string;
}
