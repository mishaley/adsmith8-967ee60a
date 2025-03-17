
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
    // We can verify that the selectedOfferingId is correctly passed to this component
  }, [props.selectedOfferingId]);

  // Make sure the selectedOfferingId is properly passed to PersonasSectionContainer
  return (
    <PersonasSectionContainer 
      {...props} 
      selectedOfferingId={props.selectedOfferingId} // Ensure this prop is explicitly passed
    />
  );
};

export default PersonasContainer;
