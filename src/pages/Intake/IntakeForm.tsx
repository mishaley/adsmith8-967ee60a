
import React, { useState } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { useIntakeForm } from "./hooks/useIntakeForm";
import { usePersonasManager } from "./hooks/personas/usePersonasManager";
import { Message } from "./components/Messages/hooks/useMessagesFetching";
import { useToast } from "@/components/ui/use-toast";
import { clearFormAndRefresh } from "./utils/localStorageUtils";
import IntakeFormContent from "./components/IntakeFormContent";

const IntakeForm = () => {
  const { toast } = useToast();
  
  const {
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
    handleSave
  } = useIntakeForm();
  
  const {
    personas,
    summary,
    isGeneratingPersonas,
    isGeneratingPortraits,
    loadingPortraitIndices,
    generatePersonas,
    updatePersona,
    retryPortraitGeneration,
    removePersona,
    personaCount,
    setPersonaCount
  } = usePersonasManager(offering, selectedCountry);

  const [generatedMessages, setGeneratedMessages] = useState<Record<string, Record<string, Message>>>({});
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>(["tagline"]);

  const handleUpdateMessages = (messages: Record<string, Record<string, Message>>, types: string[]) => {
    console.log("IntakeForm: Messages updated", { messageTypesCount: types.length, personasCount: personas.length });
    setGeneratedMessages(messages);
    setSelectedMessageTypes(types);
  };

  const handleClearForm = () => {
    clearFormAndRefresh();
    toast({
      title: "Form cleared",
      description: "All form data has been cleared from storage.",
    });
  };

  return (
    <QuadrantLayout>
      {{
        q4: (
          <IntakeFormContent
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
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            handleSave={handleSave}
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
            handleClearForm={handleClearForm}
          />
        )
      }}
    </QuadrantLayout>
  );
};

export default IntakeForm;
