
import React, { useEffect } from "react";
import { Persona } from "../Personas/types";
import PersonasSectionContainer from "../PersonasSection";
import { logDebug } from "@/utils/logging";

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
  selectedOfferingId?: string;
}

const PersonasContainer: React.FC<PersonasContainerProps> = (props) => {
  // Log the selectedOfferingId to help with debugging
  useEffect(() => {
    logDebug(`PersonasContainer - selectedOfferingId: ${props.selectedOfferingId || 'not set'}`, 'ui');
  }, [props.selectedOfferingId]);

  // Ensure the selectedOfferingId is passed to PersonasSectionContainer
  return (
    <PersonasSectionContainer {...props} />
  );
};

export default PersonasContainer;
