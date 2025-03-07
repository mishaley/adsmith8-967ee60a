
import React from "react";
import { useIntakeForm } from "./hooks/useIntakeForm";
import QuadrantLayout from "@/components/QuadrantLayout";
import SectionsContainer from "./components/Containers/SectionsContainer"; 
import { usePersonasManager } from "./hooks/personas/usePersonasManager";

const IntakeForm: React.FC = () => {
  // Get all form state and handlers from the hook
  const {
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
    selectedCountry,
    setSelectedCountry,
    adPlatform,
    setAdPlatform,
    selectedLanguage,
    setSelectedLanguage,
    personas,
    setPersonas,
    generatedMessages,
    setGeneratedMessages,
    selectedMessageTypes,
    setSelectedMessageTypes,
    handleSave
  } = useIntakeForm();

  // Get personas-related functionality
  const {
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
  } = usePersonasManager(offering, selectedCountry);

  // Handler to update messages state
  const handleUpdateMessages = (
    updatedMessages: any,
    updatedTypes: string[]
  ) => {
    setGeneratedMessages(updatedMessages);
    setSelectedMessageTypes(updatedTypes);
  };

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="bg-#d3e4fd rounded-2xl shadow-sm p-4 relative overflow-hidden max-w-6xl mx-auto">
            <SectionsContainer
              brandName={brandName}
              setBrandName={setBrandName}
              industry={industry}
              setIndustry={setIndustry}
              handleSave={handleSave}
              
              offering={offering}
              setOffering={setOffering}
              sellingPoints={sellingPoints}
              setSellingPoints={setSellingPoints}
              problemSolved={problemSolved}
              setProblemSolved={setProblemSolved}
              uniqueOffering={uniqueOffering}
              setUniqueOffering={setUniqueOffering}
              
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              adPlatform={adPlatform}
              setAdPlatform={setAdPlatform}
              
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              
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
              
              generatedMessages={generatedMessages}
              selectedMessageTypes={selectedMessageTypes}
              handleUpdateMessages={handleUpdateMessages}
            />
          </div>
        )
      }}
    </QuadrantLayout>
  );
};

export default IntakeForm;
