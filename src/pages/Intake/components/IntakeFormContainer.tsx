
import React from "react";
import IntakeHeader from "./IntakeHeader";
import IntakeFormFields from "./IntakeFormFields";
import { Persona } from "./Personas/types";
import { Message } from "./Messages/hooks/useMessagesFetching";

interface IntakeFormContainerProps {
  // Form fields
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  businessDescription: string;
  setBusinessDescription: (value: string) => void;
  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;
  adPlatform: string;
  setAdPlatform: (value: string) => void;
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  handleSave: () => void;

  // Personas
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

// Add static properties to store messages data shared between components
interface IntakeFormContainerType extends React.FC<IntakeFormContainerProps> {
  generatedMessages?: Record<string, Record<string, Message>>;
  selectedMessageTypes?: string[];
}

const IntakeFormContainer: IntakeFormContainerType = ({
  // Form fields
  brandName,
  setBrandName,
  industry,
  setIndustry,
  businessDescription,
  setBusinessDescription,
  offering,
  setOffering,
  sellingPoints,
  setSellingPoints,
  problemSolved,
  setProblemSolved,
  uniqueOffering,
  setUniqueOffering,
  adPlatform,
  setAdPlatform,
  selectedCountry,
  setSelectedCountry,
  selectedLanguage,
  setSelectedLanguage,
  handleSave,
  // Personas
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
  return <div className="bg-#d3e4fd rounded-2xl shadow-sm p-4 relative overflow-hidden max-w-6xl mx-auto">
      <IntakeHeader />
      <IntakeFormFields 
        brandName={brandName} 
        setBrandName={setBrandName} 
        industry={industry} 
        setIndustry={setIndustry} 
        businessDescription={businessDescription} 
        setBusinessDescription={setBusinessDescription} 
        offering={offering} 
        setOffering={setOffering} 
        sellingPoints={sellingPoints} 
        setSellingPoints={setSellingPoints} 
        problemSolved={problemSolved} 
        setProblemSolved={setProblemSolved} 
        uniqueOffering={uniqueOffering} 
        setUniqueOffering={setUniqueOffering} 
        adPlatform={adPlatform} 
        setAdPlatform={setAdPlatform} 
        handleSave={handleSave} 
      />
    </div>;
};

// Initialize static properties
IntakeFormContainer.generatedMessages = {};
IntakeFormContainer.selectedMessageTypes = ["tagline"];

export default IntakeFormContainer;
