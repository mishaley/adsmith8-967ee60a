import React, { useState } from "react";
import IntakeHeader from "./IntakeHeader";
import IntakeFormFields from "./IntakeFormFields";
import { Persona } from "./Personas/types";
import { PersonasSection } from "./Personas";
import { MessagesSection } from "./Messages";
import { ImagesSection } from "./Images";
import { GeoMapSection } from "./GeoMap/GeoMapSection";
import { Message } from "./Messages/hooks/useMessagesFetching";

interface IntakeFormContainerProps {
  // Form fields
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
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
}

const IntakeFormContainer: React.FC<IntakeFormContainerProps> = ({
  // Form fields
  brandName,
  setBrandName,
  industry,
  setIndustry,
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
  removePersona
}) => {
  const [generatedMessages, setGeneratedMessages] = useState<Record<string, Record<string, Message>>>({});
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>(["tagline"]);

  const handleMessagesUpdate = (messages: Record<string, Record<string, Message>>, types: string[]) => {
    setGeneratedMessages(messages);
    setSelectedMessageTypes(types);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 relative overflow-hidden max-w-6xl mx-auto">
      <IntakeHeader />
      <table className="w-full border-collapse">
        <tbody>
          <IntakeFormFields
            brandName={brandName}
            setBrandName={setBrandName}
            industry={industry}
            setIndustry={setIndustry}
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
          />
          <MessagesSection 
            personas={personas} 
            onUpdateMessages={handleMessagesUpdate}
          />
          <ImagesSection 
            personas={personas}
            generatedMessages={generatedMessages}
            selectedMessageTypes={selectedMessageTypes}
          />
          <GeoMapSection selectedCountry={selectedCountry} />
        </tbody>
      </table>
    </div>
  );
};

export default IntakeFormContainer;
