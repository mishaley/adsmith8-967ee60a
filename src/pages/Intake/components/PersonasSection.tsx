
import React from "react";
import PersonasSection from "./Personas/PersonasSection";
import { Persona } from "./Personas/types";
import CollapsibleSection from "./CollapsibleSection";

interface PersonasSectionProps {
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
  selectedOfferingId?: string; // Make sure to include this in the interface
}

const PersonasContainer: React.FC<PersonasSectionProps> = ({
  personas,
  summary,
  isGeneratingPersonas,
  isGeneratingPortraits,
  generatePersonas,
  updatePersona,
  loadingPortraitIndices,
  retryPortraitGeneration,
  removePersona,
  personaCount,
  setPersonaCount,
  isSegmented,
  setIsSegmented,
  selectedOfferingId // Make sure to destructure this prop
}) => {
  return (
    <CollapsibleSection title="PERSONAS">
      <table className="w-full border-collapse border-transparent">
        <tbody>
          <PersonasSection
            personas={personas}
            summary={summary}
            isGeneratingPersonas={isGeneratingPersonas}
            isGeneratingPortraits={isGeneratingPortraits}
            generatePersonas={generatePersonas}
            updatePersona={updatePersona}
            loadingPortraitIndices={loadingPortraitIndices}
            retryPortraitGeneration={retryPortraitGeneration}
            removePersona={removePersona}
            personaCount={personaCount}
            setPersonaCount={setPersonaCount}
            isSegmented={isSegmented}
            setIsSegmented={setIsSegmented}
            selectedOfferingId={selectedOfferingId} // Pass the selectedOfferingId to PersonasSection
          />
        </tbody>
      </table>
    </CollapsibleSection>
  );
};

export default PersonasContainer;
