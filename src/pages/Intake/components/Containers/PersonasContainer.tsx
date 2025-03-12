
import React from "react";
import { Persona } from "../Personas/types";
import PersonasSectionContainer from "../PersonasSection";

interface PersonasContainerProps {
  personas: Persona[];
  summary: string;
  isGeneratingPersonas: boolean;
  isGeneratingPortraits: boolean;
  generatePersonas: () => void;
  updatePersona: (index: number, updatedPersona: Persona) => void;
  loadingPortraitIndices: number[];
  retryPortraitGeneration: (index: number) => void;
  removePersona: (index: number) => void;
  personaCount: number;
  setPersonaCount: (count: number) => void;
  isSegmented?: boolean;
  setIsSegmented?: (isSegmented: boolean) => void;
}

const PersonasContainer: React.FC<PersonasContainerProps> = (props) => {
  return (
    <PersonasSectionContainer {...props} />
  );
};

export default PersonasContainer;
