
import React from "react";
import PersonasSection from "./Personas/PersonasSection";
import { Persona } from "./Personas/types";

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
  setPersonaCount
}) => {
  return (
    <div className="bg-[#e9f2fe] p-4 mb-6 rounded-lg">
      <h2 className="text-center text-gray-700 mb-4 font-bold text-xl">PERSONAS</h2>
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
          />
        </tbody>
      </table>
    </div>
  );
};

export default PersonasContainer;
